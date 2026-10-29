import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ComplianceChatbot } from "@/components/chat/ComplianceChatbot";
import { Sparkles, Globe, Shield, Scale } from "lucide-react";

export default async function AdvisorPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialPrompt = resolvedSearchParams?.query
    ? decodeURIComponent(resolvedSearchParams.query)
    : undefined;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1 bg-primary/10 text-primary rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Gemini Intelligence Terminal
                  </span>
                  <span className="p-1 bg-secondary/10 text-secondary rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    Search Grounding Active
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-on-surface tracking-tight">
                  Institutional AI Compliance Advisor
                </h1>
                <p className="text-on-surface-variant mt-1">
                  Multi-turn regulatory dialogue, continuous verification, and live Google Search statutory grounding.
                </p>
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-3 text-xs bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <div className="flex items-center gap-1.5 text-on-surface">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-semibold">NIST / FedRAMP Grounded</span>
                </div>
                <span className="text-outline">•</span>
                <div className="flex items-center gap-1.5 text-on-surface">
                  <Scale className="w-4 h-4 text-secondary" />
                  <span className="font-semibold">Protocol 42-B Verified</span>
                </div>
              </div>
            </div>

            {/* Main Interactive Chat Interface */}
            <ComplianceChatbot initialContextPrompt={initialPrompt} />
          </div>
        </main>
      </div>
    </div>
  );
}
