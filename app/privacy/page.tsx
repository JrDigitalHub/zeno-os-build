'use client'

import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import {
  ShieldCheck,
  Brain,
  Lock,
  Database,
  Server,
  Key,
  FileText,
  Mail,
  Copy,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Cpu,
} from 'lucide-react'

export default function PrivacyPage() {
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
                Legal Trust Portal
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-mono text-[#10B981]">
            <ShieldCheck className="w-4 h-4" />
            <span>ENTERPRISE DATA GOVERNANCE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
            Privacy Policy &amp; Architecture Standard
          </h1>
          <p className="text-base text-[#94A3B8] font-mono">
            Effective Date: July 30, 2026 · Version 2.6 Enterprise Multi-Tenant Specification
          </p>
        </div>
      </div>

      {/* ── MAIN LEGAL CONTENT ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Section 1: Data Controller */}
        <section className="p-8 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-[#10B981]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">1. Data Controller Statement</h2>
          </div>
          <p className="text-sm leading-relaxed text-[#94A3B8]">
            Zeno OS is an enterprise-grade neural business operating system owned, engineered, and operated exclusively by{' '}
            <strong className="text-[#F8FAFC]">JR Digital Hub LTD</strong>. As the data controller, JR Digital Hub LTD is committed to strict compliance with international privacy mandates, including GDPR, NDPR, and enterprise multi-tenant isolation protocols.
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="p-8 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-[#06B6D4]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">2. Information We Collect</h2>
          </div>

          <div className="space-y-4 text-sm text-[#94A3B8]">
            <div className="p-4 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-2">
              <h3 className="font-bold text-[#F8FAFC] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#10B981]" />
                Account Credentials &amp; Workspaces
              </h3>
              <p>
                We process your email address, unique tenant workspace ID, and Supabase JSON Web Tokens (JWTs) to authenticate sessions and isolate multi-tenant execution pods.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-2">
              <h3 className="font-bold text-[#F8FAFC] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#06B6D4]" />
                Financial &amp; Payment Data Integrity
              </h3>
              <p>
                Zeno OS stores transaction logs and metered token balances. <strong className="text-[#F8FAFC]">Express Statement:</strong> All raw credit card details, debit card numbers, and PINs are processed directly by our PCI-DSS Level 1 compliant payment gateway partner, <strong>Paystack</strong>. Zeno OS stores zero raw payment card credentials on our servers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-2">
              <h3 className="font-bold text-[#F8FAFC] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#10B981]" />
                Operational &amp; Agent Telemetry
              </h3>
              <p>
                To enable Oracle (Lead Gen), COO (Task Kanban), and CFO (Bookkeeping OCR) workflows, we collect document uploads, system audit logs, and search parameters. Any workspace-configured SMTP credentials are encrypted at rest using <strong>AES-256-GCM</strong> cryptography prior to database insertion.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: AI Processing & LLMs */}
        <section className="p-8 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-[#10B981]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">3. How We Process Data (AI &amp; LLM Orchestration)</h2>
          </div>

          <div className="space-y-4 text-sm text-[#94A3B8] leading-relaxed">
            <p>
              <strong className="text-[#F8FAFC]">Prompt &amp; Invoice Processing:</strong> Documents processed by the CFO Agent and prompts sent to Google Gemini Vision APIs or Qdrant vector databases are partitioned strictly by workspace ID via Postgres Row Level Security (RLS). Zero customer workspace data is submitted to public LLMs for foundation model training.
            </p>
            <p>
              <strong className="text-[#F8FAFC]">Web Scraping &amp; Lead Extraction:</strong> Public business intelligence gathered by the Oracle Agent (via Google Dorks / Serper APIs) is processed solely for outbound lead discovery requested by your workspace and is retained exclusively within your isolated tenant data store.
            </p>
          </div>
        </section>

        {/* Section 4: Data Security & Retention */}
        <section className="p-8 rounded-2xl bg-[#0F172A]/70 border border-[#1E293B] space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-[#06B6D4]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">4. Data Security &amp; Workspace Retention Rights</h2>
          </div>

          <div className="space-y-4 text-sm text-[#94A3B8] leading-relaxed">
            <p>
              Multi-tenant boundary enforcement is enforced strictly at the database layer via Supabase JWT claims and Postgres Row Level Security policies.
            </p>
            <p>
              You maintain full control over your data. You may request complete deletion or export of your workspace telemetry, financial ledger entries, and lead records by contacting our Privacy Operations desk.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1E293B] border border-[#10B981]/40 text-xs font-mono text-[#F8FAFC] transition-all group"
              >
                <Mail className="w-4 h-4 text-[#10B981]" />
                <span>ceo@jrdigitalhubltd.com</span>
                <Copy className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#10B981] transition-colors" />
              </button>
            </div>
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
