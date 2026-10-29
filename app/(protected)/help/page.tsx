"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { BookOpen, ShieldCheck, FileQuestion, ExternalLink, HelpCircle, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const APH_FAQS = [
  { 
    q: "What is the minimum land requirement for Mega/Metro Engineering Institutions?", 
    a: "Under AICTE Approval Process Handbook (APH) Appendix 4, a minimum of 5.0 contiguous acres (or 2.5 acres for specialized Central/Metro areas with approved FSI/FAR) is required for degree engineering colleges." 
  },
  { 
    q: "How does the Smart Deadline Risk Radar classify 'High Risk' cases?", 
    a: "A case is flagged as High Risk if the remaining statutory window is ≤ 3 days, or if an assigned scrutiny case has remained without committee action for > 5 days. Every flag is 100% transparent and explainable." 
  },
  { 
    q: "What happens when a Scrutiny Committee returns an application for deficiencies?", 
    a: "Under APH Cl. 4.5, the institution receives a formal deficiency notice and a mandatory 15-day cure window to resubmit corrected documents (e.g., renewed lease deed, fire NOC). The application transitions to 'Deficiencies Raised' stage." 
  },
  { 
    q: "How does the Smart Document Checker safeguard against erroneous OCR rejections?", 
    a: "OCR extractions are strictly treated as advisory aids for the officer. Missing fields or low OCR confidence trigger human review flags rather than automatic rejection or non-compliance citation." 
  },
  { 
    q: "Who is authorized to schedule and conduct EVC visits?", 
    a: "Regional EVC Coordinators empanel a 3-member Expert Visiting Committee from approved academic rosters (e.g., IIT/NIT professors and registered architects). On-site inspections require geo-tagged evidence verification." 
  }
];

export default function HelpPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded border border-amber-500/30">
                  Regulatory Handbook
                </span>
                <span className="text-xs text-slate-500 font-mono">Approval Process Handbook (APH) 2026-27</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Regulatory Guidance & FAQs
              </h1>
              <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                Statutory guidelines, scrutiny checklists, land and building norms, and feature documentation.
              </p>
            </div>

            {/* Handbook Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">AICTE Approval Process Handbook (APH)</h3>
                <p className="text-slate-600 leading-relaxed">
                  Official statutory guidelines for Technical, Management, Pharmacy, and Architecture institutions covering Extension of Approval (EoA), New Course Additions, and Division conversions.
                </p>
                <div className="pt-2">
                  <Link href="/advisor" className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
                    <span>Query Handbook via AI Statutory Advisor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Statutory Scrutiny Checklist</h3>
                <p className="text-slate-600 leading-relaxed">
                  Prescribed documentation standards: Registered 30-year/99-year Lease Deeds, Fire Safety Form B NOC, Building Completion Certificates, and 7th CPC Faculty Pay Scale Compliance.
                </p>
                <div className="pt-2">
                  <Link href="/documents" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                    <span>Open Smart Document Checker</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQs Accordion/List */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileQuestion className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4 text-xs divide-y divide-slate-100">
                {APH_FAQS.map((faq, idx) => (
                  <div key={idx} className="pt-3 first:pt-0">
                    <p className="font-bold text-slate-900 text-sm">{faq.q}</p>
                    <p className="text-slate-600 mt-1.5 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
