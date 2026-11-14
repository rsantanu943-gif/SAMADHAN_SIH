import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
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
    <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
          <div className="flex-1 p-5 sm:p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D5DDCB] pb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-[#B7C9A8]/45 text-[#263B32] border border-[#B7C9A8] rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#2A6557]" />
                      Gemini Intelligence Terminal
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#8FCDBB]/35 text-[#263B32] border border-[#8FCDBB] rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#2A6557]" />
                      Search Grounding Active
                    </span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight">
                    Institutional AI Compliance Advisor
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-1">
                    Multi-turn regulatory dialogue, continuous verification, and live Google Search statutory grounding.
                  </p>
                </div>

                {/* Status Chips */}
                <div className="flex flex-wrap items-center gap-3 text-xs bg-[#FAF8F1] px-3.5 py-2.5 rounded-xl border border-[#D5DDCB]">
                  <div className="flex items-center gap-1.5 text-[#263B32]">
                    <Shield className="w-4 h-4 text-[#2A6557]" />
                    <span className="font-semibold">NIST / FedRAMP Grounded</span>
                  </div>
                  <span className="text-[#D5DDCB]">•</span>
                  <div className="flex items-center gap-1.5 text-[#263B32]">
                    <Scale className="w-4 h-4 text-[#2A6557]" />
                    <span className="font-semibold">Protocol 42-B Verified</span>
                  </div>
                </div>
              </div>

              {/* Main Interactive Chat Interface */}
              <ComplianceChatbot initialContextPrompt={initialPrompt} />
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
