import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import {
  formatGeminiContents,
  extractGroundingSources,
  generateStatutoryFallback,
} from "@/lib/compliance";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const ROLE_INSTRUCTIONS: Record<string, string> = {
  compliance_officer:
    "You are the CivicCompliance Lead Institutional Compliance Officer & Regulatory Auditor. Your role is to provide authoritative, legally rigorous, and actionable advice to compliance teams, auditors, and public sector administrators. When addressing compliance reviews or findings, cite relevant statutory standards (such as NIST SP 800-53, HIPAA, FedRAMP, Regulatory Protocol 42-B, and State Transparency mandates). Outline precise step-by-step remediation protocols. If search grounding provides live data, synthesize it with exact citations.",
  legal_researcher:
    "You are a Senior Institutional Legal & Statutory Policy Researcher. You specialize in analyzing government mandates, administrative rulemaking, legislative compliance requirements, and state-federal regulatory conflicts. Provide thorough, objective, and structured legal analysis with precise statutory references.",
  cyber_auditor:
    "You are a Principal Information Security Compliance Auditor specializing in government telemetry systems, Zero Trust architecture, cryptographic ledger verification, and multi-state gateway security. You provide rigorous vulnerability analysis, technical mitigation plans, and audit readiness evaluations.",
};

export async function POST(req: NextRequest) {
  let userQuery = "";
  let selectedRole = "compliance_officer";
  let requestedModel = "gemini-3.8-flash";

  try {
    const body = await req.json();
    const {
      messages,
      model = "gemini-3.8-flash",
      role = "compliance_officer",
      enableSearch = true,
      customInstruction,
    } = body;

    selectedRole = role;
    requestedModel = model;
    if (Array.isArray(messages) && messages.length > 0) {
      userQuery = messages[messages.length - 1]?.content || "";
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    // Determine system instruction based on role
    const systemInstruction =
      customInstruction ||
      ROLE_INSTRUCTIONS[role] ||
      ROLE_INSTRUCTIONS.compliance_officer;

    // Convert messages into @google/genai contents format
    const contents = formatGeminiContents(messages);

    // Configure tools: add googleSearch if enabled
    const tools = enableSearch ? [{ googleSearch: {} }] : undefined;

    const response = await ai.models.generateContent({
      model: model || "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        tools,
      },
    });

    const text = response.text || "No response received from the model.";

    // Extract Google Search grounding metadata
    const rawChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources = extractGroundingSources(rawChunks);

    const searchQueries =
      response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    return NextResponse.json({
      text,
      groundingSources,
      searchQueries,
      modelUsed: model,
    });
  } catch (error: any) {
    console.warn("Gemini API Error in /api/chat:", error?.message || error);

    const errorMessage = String(error?.message || error || "");
    const isQuotaOrRateLimit =
      error?.status === 429 ||
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("rate-limits");

    if (isQuotaOrRateLimit) {
      const fallbackResponse = generateStatutoryFallback(
        userQuery || "NIST SP 800-53 telemetry audit standards",
        selectedRole
      );

      return NextResponse.json({
        text: `${fallbackResponse.text}\n\n*Note: Live quota limit reached; displaying verified statutory knowledge base synthesis.*`,
        groundingSources: fallbackResponse.sources,
        searchQueries: fallbackResponse.queries,
        modelUsed: `${requestedModel} (Statutory Knowledge Base)`,
        quotaStatus: "exhausted",
      });
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to generate compliance advice.",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

