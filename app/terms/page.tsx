'use client'

import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import {
  FileText,
  Brain,
  ShieldAlert,
  CreditCard,
  AlertTriangle,
  Code2,
  Mail,
  Copy,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export default function TermsPage() {
  const { toast } = useToast()

  const handleCopyEmail = () => {
    const email = 'ceo@jrdigitalhubltd.com'
    navigator.clipboard.writeText(email)
    toast({
      title: 'Copied to Clipboard',
      description: `Copied ${email} to clipboard`,
    })
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-[#E2E8F0] font-sans selection:bg-[#00F2FE]/20 selection:text-[#E2E8F0]">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#090D16]/90 backdrop-blur-md border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#06B6D4] p-0.5 flex items-center justify-center shadow-lg shadow-[#10B981]/20">
              <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#10B981]" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">
                ZENO<span className="text-[#10B981]"> OS</span>
              </span>
              <span className="block text-[10px] font-mono text-[#64748B] uppercase tracking-widest -mt-1">
                Legal Terms Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Landing Page
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#090D16] text-sm font-bold shadow-lg shadow-[#10B981]/20 transition-all"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <div className="relative border-b border-[#1E293B] bg-gradient-to-b from-[#0F172A]/50 to-transparent py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-xs font-mono text-[#06B6D4]">
            <FileText className="w-4 h-4" />
            <span>TERMS OF SERVICE &amp; ACCEPTABLE USE POLICY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
            Terms of Service &amp; Operating Agreement
          </h1>
          <p className="text-base text-[#94A3B8] font-mono">
            Effective Date: July 30, 2026 · JR Digital Hub LTD Commercial License
          </p>
        </div>
      </div>

      {/* ── MAIN LEGAL CONTENT ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Section 1: Acceptance & Platform Scope */}
        <section className="p-8 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">1. Acceptance &amp; Platform Scope</h2>
          </div>
          <p className="text-sm leading-relaxed text-[#94A3B8]">
            By registering an account or initializing a session on Zeno OS, you agree to be bound by this Operating Agreement. Zeno OS is an autonomous operations management platform featuring three core neural agents—<strong className="text-[#F8FAFC]">Oracle</strong> (lead generation), <strong className="text-[#F8FAFC]">COO</strong> (task/kanban automation), and <strong className="text-[#F8FAFC]">CFO</strong> (bookkeeping/OCR)—engineered and provided by <strong className="text-[#F8FAFC]">JR Digital Hub LTD</strong>.
          </p>
        </section>

        {/* Section 2: Acceptable Use Policy (AUP) */}
        <section className="p-8 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-[#06B6D4]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">2. Acceptable Use Policy (AUP)</h2>
          </div>

          <div className="space-y-4 text-sm text-[#94A3B8]">
            <div className="p-4 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-2">
              <h3 className="font-bold text-[#F8FAFC]">Outbound Email &amp; Anti-Spam Compliance</h3>
              <p>
                Users utilizing the Email Engine or Oracle lead dispatch agree to adhere strictly to CAN-SPAM, GDPR, and local outbound communications regulations. Phishing, unauthorized spamming, or abusive cold-email practices are strictly prohibited and trigger immediate account termination without refund.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-2">
              <h3 className="font-bold text-[#F8FAFC]">Automated Operations Responsibility</h3>
              <p>
                You are solely responsible for setting auto-approval thresholds for autonomous COO task dispatches and CFO financial ledger entries. You agree to inspect AI agent outputs prior to final execution where high risk is present.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Token Economy & Billing Rules */}
        <section className="p-8 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-[#10B981]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">3. Token Economy &amp; Billing Rules</h2>
          </div>

          <div className="space-y-4 text-sm text-[#94A3B8] leading-relaxed">
            <p>
              Zeno OS offers structured plans: <strong className="text-[#F8FAFC]">Starter (₦14,999/mo)</strong> and <strong className="text-[#F8FAFC]">Professional (₦99,999/mo)</strong>, billed recurringly via <strong>Paystack</strong>.
            </p>
            <p>
              Neural Compute Token Consumption: Backend execution workers deduct tokens per interaction (e.g., approximately 150 tokens/chat or OCR run). Tokens consumed during background worker processing are non-refundable.
            </p>
          </div>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="p-8 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-[#E0A052]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">4. Limitation of Liability &amp; AI Disclaimer</h2>
          </div>

          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Zeno OS agents operate using both deterministic rule engines and probabilistic generative AI models. JR Digital Hub LTD expressly disclaims all liability for commercial decisions, misdirected communications, or accounting discrepancies resulting from automated agent execution.
          </p>
        </section>

        {/* Section 5: Intellectual Property */}
        <section className="p-8 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-[#10B981]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">5. Proprietary Intellectual Property</h2>
          </div>

          <p className="text-sm text-[#94A3B8] leading-relaxed">
            All codebases, agent topologies, River queue orchestration logic, and neural algorithms powering Zeno OS are the exclusive intellectual property of <strong>JR Digital Hub LTD</strong>.
          </p>

          <div className="pt-4">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1E293B] border border-[#10B981]/40 text-xs font-mono text-[#F8FAFC] transition-all group"
            >
              <Mail className="w-4 h-4 text-[#10B981]" />
              <span>ceo@jrdigitalhubltd.com</span>
              <Copy className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#10B981] transition-colors" />
            </button>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1E293B] bg-[#090D16] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-mono text-[#64748B]">
          ZENO OS // JR DIGITAL HUB LTD. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  )
}
