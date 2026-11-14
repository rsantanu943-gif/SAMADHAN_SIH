"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, ShieldCheck, FileQuestion, ExternalLink } from "lucide-react";
import Link from "next/link";

const APH_FAQS = [
  {
    q: "What is the minimum land requirement for Mega/Metro Engineering Institutions?",
    a: "Under AICTE Approval Process Handbook (APH) Appendix 4, a minimum of 5.0 contiguous acres (or 2.5 acres for specialized Central/Metro areas with approved FSI/FAR) is required for degree engineering colleges.",
  },
  {
    q: "How does the Smart Deadline Risk Radar classify 'High Risk' cases?",
    a: "A case is flagged as High Risk if the remaining statutory window is ≤ 3 days, or if an assigned scrutiny case has remained without committee action for > 5 days. Every flag is 100% transparent and explainable.",
  },
  {
    q: "What happens when a Scrutiny Committee returns an application for deficiencies?",
    a: "Under APH Cl. 4.5, the institution receives a formal deficiency notice and a mandatory 15-day cure window to resubmit corrected documents (e.g., renewed lease deed, fire NOC). The application transitions to 'Deficiencies Raised' stage.",
  },
  {
    q: "How does the Smart Document Checker safeguard against erroneous OCR rejections?",
    a: "OCR extractions are strictly treated as advisory aids for the officer. Missing fields or low OCR confidence trigger human review flags rather than automatic rejection or non-compliance citation.",
  },
  {
    q: "Who is authorized to schedule and conduct EVC visits?",
    a: "Regional EVC Coordinators empanel a 3-member Expert Visiting Committee from approved academic rosters (e.g., IIT/NIT professors and registered architects). On-site inspections require geo-tagged evidence verification.",
  },
];

export default function HelpPage() {
  return (
    <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
          <div className="flex-1 p-5 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="border-b border-[#D5DDCB] pb-5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-[#B7C9A8]/45 text-[#263B32] px-2.5 py-0.5 rounded border border-[#B7C9A8]">
                    Regulatory Handbook
                  </span>
                  <span className="text-xs text-[#68776A] font-mono">
                    Approval Process Handbook (APH) 2026–27
                  </span>
                </div>
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                  Regulatory Guidance &amp; FAQs
                </h1>
                <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                  Statutory guidelines, scrutiny checklists, land and building norms, and feature documentation.
                </p>
              </div>

              {/* Handbook Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="surface-card-interactive p-5 space-y-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#EAE2D2] border border-[#D5DDCB] flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#263B32]" />
                  </div>
                  <h3 className="font-display font-bold text-base text-[#263B32]">
                    AICTE Approval Process Handbook (APH)
                  </h3>
                  <p className="text-[#576659] leading-relaxed">
                    Official statutory guidelines for Technical, Management, Pharmacy, and Architecture institutions covering Extension of Approval (EoA), New Course Additions, and Division conversions.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/advisor"
                      className="text-xs font-bold text-[#2A6557] hover:underline flex items-center gap-1"
                    >
                      <span>Query Handbook via AI Statutory Advisor</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="surface-card-interactive p-5 space-y-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#8FCDBB]/30 border border-[#8FCDBB] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#263B32]" />
                  </div>
                  <h3 className="font-display font-bold text-base text-[#263B32]">
                    Statutory Scrutiny Checklist
                  </h3>
                  <p className="text-[#576659] leading-relaxed">
                    Prescribed documentation standards: Registered 30-year/99-year Lease Deeds, Fire Safety Form B NOC, Building Completion Certificates, and 7th CPC Faculty Pay Scale Compliance.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/documents"
                      className="text-xs font-bold text-[#2A6557] hover:underline flex items-center gap-1"
                    >
                      <span>Open Smart Document Checker</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* FAQs List */}
              <div className="surface-card p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#D5DDCB] pb-3">
                  <FileQuestion className="w-5 h-5 text-[#2A6557]" />
                  <h2 className="text-sm font-bold text-[#263B32] uppercase tracking-wider">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-4 text-xs divide-y divide-[#D5DDCB]/60">
                  {APH_FAQS.map((faq, idx) => (
                    <div key={idx} className="pt-3.5 first:pt-0">
                      <p className="font-bold text-[#263B32] text-sm">{faq.q}</p>
                      <p className="text-[#576659] mt-1.5 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
