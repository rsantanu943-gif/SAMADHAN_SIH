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
  ChevronDown,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Cpu,
  BookOpen,
  HelpCircle,
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
      "**Welcome to the CivicCompliance AI Advisory Terminal.**\n\nI am configured with multi-state statutory databases and real-time **Google Search Grounding** to assist with:\n\n* **Regulatory Inquiries**: Clarifying federal & state statutory mandates (NIST 800-53, HIPAA, FedRAMP, Clean Air acts).\n* **Audit Remediation**: Developing corrective action plans for flagged telemetry or security findings.\n* **Live Verification**: Cross-referencing current administrative rulemaking and enforcement notices via Google Search.\n\nHow can I support your compliance review today?",
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
        "bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col h-[750px] shadow-subtle overflow-hidden",
        className
      )}
    >
      {/* Terminal Top Control Bar */}
      <div className="px-6 py-3.5 border-b border-outline-variant bg-surface-container-low flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-on-surface">
                CivicAI Compliance Terminal
              </h3>
              <Badge variant="info" className="text-[10px] px-1.5 py-0 font-mono">
                {selectedModel.replace("gemini-", "")}
              </Badge>
            </div>
            <p className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
              Institutional Session Active
            </p>
          </div>
        </div>

        {/* Configuration Selectors */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Role Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-outline-variant px-2.5 py-1 rounded-md">
            <span className="text-outline text-[11px] font-semibold">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-xs font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="compliance_officer">Compliance Officer</option>
              <option value="legal_researcher">Legal & Statutory Researcher</option>
              <option value="cyber_auditor">InfoSec & Telemetry Auditor</option>
            </select>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-outline-variant px-2.5 py-1 rounded-md">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-xs font-medium text-on-surface focus:outline-none cursor-pointer"
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
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold transition-all cursor-pointer",
              enableSearch
                ? "bg-secondary-container text-on-secondary-container border-secondary/30"
                : "bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high"
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
            className="p-1.5 text-outline hover:text-error hover:bg-error-container/20 rounded-md transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Messages Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-surface/50">
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
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 border border-primary/20 mt-1">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={cn(
                  "rounded-lg p-4 text-sm leading-relaxed max-w-[85%] shadow-sm",
                  isUser
                    ? "bg-[#0284C7] text-white"
                    : "bg-white border border-outline-variant text-on-surface"
                )}
              >
                {/* Message Header info */}
                <div
                  className={cn(
                    "flex items-center justify-between text-[11px] font-semibold mb-2 pb-1.5 border-b",
                    isUser
                      ? "border-white/20 text-white/80"
                      : "border-outline-variant/30 text-on-surface-variant"
                  )}
                >
                  <span>
                    {isUser ? "Auditor / Compliance Officer" : "CivicAI Advisory Engine"}
                  </span>
                  <span className="tabular-nums font-mono opacity-80">{message.timestamp}</span>
                </div>

                {/* Markdown Content */}
                <div
                  className={cn(
                    "prose prose-sm max-w-none break-words",
                    isUser
                      ? "text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-ul:text-white prose-li:text-white prose-code:text-white prose-code:bg-white/10"
                      : "text-on-surface prose-headings:text-on-surface prose-strong:text-on-surface prose-code:text-primary prose-code:bg-surface-container prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                  )}
                >
                  <Markdown>{message.content}</Markdown>
                </div>

                {/* Google Search Grounding Citations */}
                {!isUser &&
                  message.groundingSources &&
                  message.groundingSources.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-outline-variant/40">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-secondary uppercase tracking-wider mb-2">
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
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-container/40 hover:bg-secondary-container/70 border border-secondary/20 text-[11px] text-on-secondary-container font-medium transition-colors"
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
                    <div className="mt-2 text-[10px] text-outline font-mono">
                      Query Grounding: {message.searchQueries.join(" • ")}
                    </div>
                  )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant text-on-surface mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-4xl">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 border border-primary/20">
              <Sparkles className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-white border border-outline-variant rounded-lg p-4 text-sm text-on-surface-variant flex items-center gap-3 shadow-sm">
              <RefreshCw className="w-4 h-4 text-primary animate-spin" />
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
          <div className="bg-error-container/30 border border-error/30 p-3.5 rounded-lg flex items-start gap-2.5 text-xs text-error">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Advisory Terminal Notice: </span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Strip */}
      <div className="px-6 py-2.5 border-t border-outline-variant/40 bg-surface-container-low overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-outline shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          Suggested:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-xs bg-white hover:bg-primary-container/20 border border-outline-variant hover:border-primary/40 px-2.5 py-1 rounded-full whitespace-nowrap text-on-surface-variant hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
        <div className="relative flex items-center gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask regarding regulatory compliance standards, audit findings, or search live statutory updates (Enter to send)..."
            rows={2}
            className="w-full pl-4 pr-14 py-2.5 text-sm bg-surface-container-low border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-on-surface placeholder:text-outline"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2.5 h-8 px-3 rounded-md"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2 text-[11px] text-outline px-1">
          <span>
            Powered by <strong>{selectedModel}</strong> •{" "}
            {enableSearch ? "Google Search Grounding Enabled" : "Offline Knowledge Base"}
          </span>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
