"use client";

import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Globe,
  RefreshCw,
  ExternalLink,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Cpu,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  groundingSources?: Array<{ uri: string; title: string }>;
  searchQueries?: string[];
  modelUsed?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    content:
      "**Welcome to the Samadhan360 Statutory AI Advisory Terminal.**\n\nI am configured with multi-state statutory databases and real-time **Google Search Grounding** to assist with:\n\n* **Regulatory Inquiries**: Clarifying AICTE APH 2026, federal & state statutory mandates.\n* **Audit Remediation**: Developing corrective action plans for flagged telemetry or documentary deficiencies.\n* **Live Verification**: Cross-referencing current administrative rulemaking and enforcement notices via Google Search.\n\nHow can I support your compliance review today?",
    timestamp: "Just now",
  },
];

const SUGGESTED_PROMPTS = [
  "What are the latest NIST SP 800-53 telemetry audit standards?",
  "Analyze remediation steps for legacy API security in AUD-2024-002",
  "Search recent EPA and state environmental compliance enforcement actions",
  "What criteria are needed for a Protocol 42-B justification waiver?",
];

let messageCounter = 0;

function createMessage(
  role: "user" | "assistant",
  content: string,
  extra: Partial<ChatMessage> = {}
): ChatMessage {
  messageCounter += 1;
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return {
    id: `${role}-${messageCounter}`,
    role,
    content,
    timestamp: time,
    ...extra,
  };
}

export function ComplianceChatbot({
  initialContextPrompt,
  className,
}: {
  initialContextPrompt?: string;
  className?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState(initialContextPrompt || "");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.8-flash");
  const [selectedRole, setSelectedRole] = useState<string>("compliance_officer");
  const [enableSearch, setEnableSearch] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setError(null);
    setLastPrompt(text);
    const userMessage = createMessage("user", text);

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          role: selectedRole,
          enableSearch: enableSearch,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to contact Gemini advisory server");
      }

      const botMessage = createMessage("assistant", data.text, {
        groundingSources: data.groundingSources,
        searchQueries: data.searchQueries,
        modelUsed: data.modelUsed,
      });

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setError(null);
  };

  return (
    <div
      className={cn(
        "bg-[#FAF8F1] border border-[#D5DDCB] rounded-xl flex flex-col h-[740px] shadow-[0_6px_24px_-8px_rgba(38,59,50,0.12)] overflow-hidden",
        className
      )}
    >
      {/* Terminal Top Control Bar */}
      <div className="px-5 py-3.5 border-b border-[#D5DDCB] bg-[#EAE2D2]/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#263B32] flex items-center justify-center text-[#8FCDBB] shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#263B32]">
                Samadhan360 AI Compliance Terminal
              </h3>
              <Badge variant="info" className="text-[10px] px-1.5 py-0 font-mono">
                {selectedModel.replace("gemini-", "")}
              </Badge>
            </div>
            <p className="text-[11px] text-[#68776A] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#8FCDBB] border border-[#263B32]/40 inline-block" />
              Institutional Session Active
            </p>
          </div>
        </div>

        {/* Configuration Selectors */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Role Selector */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F1] border border-[#D5DDCB] px-2.5 py-1 rounded-lg">
            <span className="text-[#68776A] text-[11px] font-semibold">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#263B32] focus:outline-none cursor-pointer"
            >
              <option value="compliance_officer">Compliance Officer</option>
              <option value="legal_researcher">Legal &amp; Statutory Researcher</option>
              <option value="cyber_auditor">InfoSec &amp; Telemetry Auditor</option>
            </select>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F1] border border-[#D5DDCB] px-2.5 py-1 rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-[#2A6557]" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#263B32] focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (General + Search)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Tasks)</option>
              <option value="gemini-4-argon">gemini-4-argon (Complex Legal Reasoning)</option>
            </select>
          </div>

          {/* Search Grounding Toggle */}
          <button
            onClick={() => setEnableSearch(!enableSearch)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer",
              enableSearch
                ? "bg-[#8FCDBB]/40 text-[#263B32] border-[#8FCDBB]"
                : "bg-[#FAF8F1] text-[#68776A] border-[#D5DDCB] hover:bg-[#EAE2D2]"
            )}
            title="Toggle live Google Search Grounding to verify recent statutory updates"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search Grounding: {enableSearch ? "ON" : "OFF"}</span>
          </button>

          {/* Reset Thread Button */}
          <button
            onClick={clearChat}
            aria-label="Clear chat conversation"
            className="p-1.5 text-[#68776A] hover:text-[#8C2D25] hover:bg-[#F5DDD9] rounded-lg transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Messages Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F3EBDD]/55">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-4xl",
                isUser ? "ml-auto justify-end" : "mr-auto justify-start"
              )}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#263B32] text-[#8FCDBB] flex items-center justify-center shrink-0 border border-[#8FCDBB]/40 mt-1">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}

              <div
                className={cn(
                  "rounded-xl p-4 text-sm leading-relaxed max-w-[85%] shadow-xs",
                  isUser
                    ? "bg-[#263B32] text-[#FAF8F1] border border-[#263B32]"
                    : "bg-[#FAF8F1] border border-[#D5DDCB] text-[#263B32]"
                )}
              >
                {/* Message Header info */}
                <div
                  className={cn(
                    "flex items-center justify-between text-[11px] font-semibold mb-2 pb-1.5 border-b",
                    isUser
                      ? "border-[#8FCDBB]/25 text-[#8FCDBB]"
                      : "border-[#D5DDCB] text-[#68776A]"
                  )}
                >
                  <span>
                    {isUser ? "Auditor / Compliance Officer" : "Samadhan360 Advisory Engine"}
                  </span>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="tabular-nums font-mono opacity-85">{message.timestamp}</span>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(message.content);
                          setCopiedId(message.id);
                          setTimeout(() => setCopiedId((prev) => (prev === message.id ? null : prev)), 2000);
                        }}
                        aria-label="Copy response"
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#EAE2D2]/80 hover:bg-[#8FCDBB]/40 text-[#263B32] text-[10px] font-semibold cursor-pointer transition-colors"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#2A6557]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Markdown Content */}
                <div
                  className={cn(
                    "prose prose-sm max-w-none break-words",
                    isUser
                      ? "text-[#FAF8F1] prose-headings:text-[#FAF8F1] prose-p:text-[#FAF8F1] prose-strong:text-[#8FCDBB] prose-ul:text-[#FAF8F1] prose-li:text-[#FAF8F1] prose-code:text-[#FAF8F1] prose-code:bg-[#FAF8F1]/10"
                      : "text-[#263B32] prose-headings:text-[#263B32] prose-strong:text-[#263B32] prose-code:text-[#263B32] prose-code:bg-[#EAE2D2] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                  )}
                >
                  <Markdown>{message.content}</Markdown>
                </div>

                {/* Google Search Grounding Citations */}
                {!isUser &&
                  message.groundingSources &&
                  message.groundingSources.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-[#D5DDCB]">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2A6557] uppercase tracking-wider mb-2">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Google Search Grounding Sources ({message.groundingSources.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {message.groundingSources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#8FCDBB]/30 hover:bg-[#8FCDBB]/50 border border-[#8FCDBB] text-[11px] text-[#263B32] font-medium transition-colors"
                          >
                            <span className="truncate max-w-[200px]">{source.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Search Queries used */}
                {!isUser &&
                  message.searchQueries &&
                  message.searchQueries.length > 0 && (
                    <div className="mt-2 text-[10px] text-[#68776A] font-mono">
                      Query Grounding: {message.searchQueries.join(" • ")}
                    </div>
                  )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-[#EAE2D2] flex items-center justify-center shrink-0 border border-[#D5DDCB] text-[#263B32] mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-4xl">
            <div className="w-8 h-8 rounded-full bg-[#263B32] text-[#8FCDBB] flex items-center justify-center shrink-0 border border-[#8FCDBB]/40">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#FAF8F1] border border-[#D5DDCB] rounded-xl p-4 text-sm text-[#68776A] flex items-center gap-3 shadow-xs">
              <RefreshCw className="w-4 h-4 text-[#2A6557] animate-spin" />
              <span>
                {enableSearch
                  ? "Querying regulatory models and retrieving Google Search grounding data..."
                  : "Synthesizing statutory compliance analysis..."}
              </span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-[#F5DDD9] border border-[#DFACA5] p-3.5 rounded-xl flex items-center justify-between gap-2.5 text-xs text-[#5E1A14]">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Advisory Terminal Notice: </span>
                <span>{error}</span>
              </div>
            </div>
            {lastPrompt && (
              <button
                type="button"
                onClick={() => handleSendMessage(lastPrompt)}
                className="px-2.5 py-1 rounded-md bg-[#FAF8F1] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] font-bold shrink-0 cursor-pointer"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Strip */}
      <div className="px-5 py-2.5 border-t border-[#D5DDCB] bg-[#EAE2D2]/60 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-[#68776A] shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#2A6557]" />
          Suggested:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-xs bg-[#FAF8F1] hover:bg-[#8FCDBB]/35 border border-[#D5DDCB] hover:border-[#8FCDBB] px-3 py-1 rounded-lg whitespace-nowrap text-[#263B32] transition-all disabled:opacity-50 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-4 border-t border-[#D5DDCB] bg-[#FAF8F1]">
        <div className="relative flex items-center gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask regarding regulatory compliance standards, audit findings, or search live statutory updates (Enter to send)..."
            rows={2}
            className="w-full pl-4 pr-14 py-2.5 text-sm bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/50 focus:border-[#8FCDBB] resize-none text-[#263B32] placeholder:text-[#68776A]"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2.5 h-8 px-3 rounded-lg"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2 text-[11px] text-[#68776A] px-1">
          <span>
            Powered by <strong className="text-[#263B32]">{selectedModel}</strong> •{" "}
            {enableSearch ? "Google Search Grounding Enabled" : "Offline Knowledge Base"}
          </span>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
