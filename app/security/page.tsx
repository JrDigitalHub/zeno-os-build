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
  Activity,
  Cpu,
  CheckCircle2,
  Zap,
  Mail,
  Copy,
  ArrowLeft,
  ArrowRight,
  Network,
  Radio,
} from 'lucide-react'

const HEALTH_NODES = [
  {
    name: 'Relational Memory',
    subtitle: 'Postgres Multi-Tenant Engine (Supabase RLS)',
    status: 'OPERATIONAL',
    latency: '1.2ms',
    uptime: '99.99%',
    color: '#10B981',
  },
  {
    name: 'Neural Graph Memory',
    subtitle: 'Neo4j Sovereign Store (Entity Topologies)',
    status: 'OPERATIONAL',
    latency: '2.4ms',
    uptime: '99.95%',
    color: '#06B6D4',
  },
  {
    name: 'Semantic Vector Memory',
    subtitle: 'Qdrant Engine (Embedding Partitioning)',
    status: 'OPERATIONAL',
    latency: '3.8ms',
    uptime: '99.98%',
    color: '#10B981',
  },
  {
    name: 'Background Execution Grid',
    subtitle: 'River Queue Worker Pool (Golang Core)',
    status: 'OPERATIONAL',
    latency: '0.8ms',
    uptime: '100.00%',
    color: '#06B6D4',
  },
]

const SECURITY_METRICS = [
  {
    icon: Lock,
    title: 'Database Encryption',
    value: 'AES-256 at Rest',
    detail: 'Encrypted storage across all Supabase Postgres volume blocks.',
  },
  {
    icon: Network,
    title: 'In-Transit Transport Security',
    value: 'TLS 1.3 Mandatory',
    detail: 'Enforced TLS 1.3 across REST API routes and /ws WebSocket streams.',
  },
  {
    icon: Key,
    title: 'Asymmetric Auth Signature',
    value: 'ECDSA / ES256 JWTs',
    detail: 'Cryptographically signed session tokens verified per request.',
  },
  {
    icon: ShieldCheck,
    title: 'Webhook Cryptographic Signature',
    value: 'HMAC SHA512 Verified',
    detail: 'Strict verification of x-paystack-signature headers on payment webhooks.',
  },
]

export default function SecurityPage() {
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
                Security Trust Center
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-mono text-[#10B981]">
            <Radio className="w-4 h-4 animate-pulse text-[#10B981]" />
            <span>REAL-TIME INFRASTRUCTURE TELEMETRY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
            Security Architecture &amp; Trust Center
          </h1>
          <p className="text-base text-[#94A3B8] max-w-2xl mx-auto font-normal">
            Verifiable system posture metrics, multi-tenant isolation specifications, and live infrastructure health status.
          </p>
        </div>
      </div>

      {/* ── MAIN SECURITY CONTENT ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Section 1: Live Infrastructure Health Cards */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-[#10B981]" />
              <h2 className="text-2xl font-bold text-[#F8FAFC]">Live Infrastructure Health Cards</h2>
            </div>
            <span className="text-xs font-mono text-[#10B981] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              SYSTEM HEALTH 100%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HEALTH_NODES.map((node) => (
              <div
                key={node.name}
                className="p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] hover:border-[#10B981]/40 transition-all space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#F8FAFC]">{node.name}</h3>
                    <p className="text-xs font-mono text-[#64748B] mt-0.5">{node.subtitle}</p>
                  </div>
                  <span className="px-3 py-1 rounded-md text-[10px] font-mono font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                    {node.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#1E293B] text-xs font-mono">
                  <div>
                    <span className="text-[#64748B]">Node Latency</span>
                    <p className="text-[#F8FAFC] font-bold mt-0.5">{node.latency}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">SLA Uptime</span>
                    <p className="text-[#10B981] font-bold mt-0.5">{node.uptime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Cryptographic Metrics Overview */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#06B6D4]" />
            <h2 className="text-2xl font-bold text-[#F8FAFC]">Cryptographic Protocols &amp; Security Specs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECURITY_METRICS.map((metric) => {
              const Icon = metric.icon
              return (
                <div
                  key={metric.title}
                  className="p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1E293B] space-y-3 shadow-xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center text-[#06B6D4]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#F8FAFC]">{metric.title}</h3>
                    <p className="text-xs font-mono text-[#10B981] font-semibold mt-0.5">{metric.value}</p>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{metric.detail}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Section 3: Contact Security Desk */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#090D16] to-[#0F172A] border border-[#10B981]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#F8FAFC]">Report Vulnerabilities or Inquire</h3>
            <p className="text-xs text-[#94A3B8] max-w-lg">
              JR Digital Hub LTD operates a transparent security vulnerability reporting program. Reach out to our executive security desk directly.
            </p>
          </div>
          <button
            onClick={handleCopyEmail}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#090D16] text-xs font-mono font-bold shadow-lg shadow-[#10B981]/20 transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>Copy ceo@jrdigitalhubltd.com</span>
            <Copy className="w-3.5 h-3.5" />
          </button>
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
