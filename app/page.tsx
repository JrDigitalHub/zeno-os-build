'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import {
  Bot,
  Brain,
  LineChart,
  ShieldCheck,
  Zap,
  Check,
  ArrowRight,
  Star,
  ChevronRight,
  Terminal,
  Cpu,
  Lock,
  FileSpreadsheet,
  Users,
  Layers,
  Sparkles,
  Menu,
  X,
  Shield,
  Activity,
  Globe,
  Database,
  Copy,
  Mail,
} from 'lucide-react'

// ── Navigation Anchors ──
const NAV_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'Neural Agents', href: '#agents' },
  { name: 'Architecture', href: '#architecture' },
  { name: 'Pricing', href: '#pricing' },
]

// ── Agents Data ──
const AGENTS = [
  {
    id: 'oracle',
    moduleNumber: 'MODULE 01',
    name: 'Oracle',
    role: 'Lead Generation & Market Intelligence Engine',
    icon: Brain,
    description:
      'Differentiated neural operating system technology pushing the boundaries of intelligence discovery. Scours channels, enriches firmographic data, and predicts high-intent leads.',
    capabilities: [
      'Automated Lead Discovery & Verification',
      'Intent Signals & B2B Enrichment',
      'Real-time Market Telemetry & Analysis',
      'Predictive Opportunity Scoring',
    ],
    accentColor: '#c9a84c',
  },
  {
    id: 'coo',
    moduleNumber: 'MODULE 02',
    name: 'COO Agent',
    role: 'Task & Kanban Workflow Operations',
    icon: Bot,
    description:
      'A highly secure digital infrastructure designed for executive-level oversight. Establishes trusted, isolated sessions for sensitive operational tasks and Kanban management.',
    capabilities: [
      'Autonomous Kanban Task Dispatching',
      'Schedules & Team Workflow Orchestration',
      'System Bottleneck Alerts & Auto-Resolution',
      'Cross-departmental Workstream Tracking',
    ],
    accentColor: '#20b2aa',
  },
  {
    id: 'cfo',
    moduleNumber: 'MODULE 03',
    name: 'CFO Agent',
    role: 'Bookkeeping & Automated Invoice OCR',
    icon: LineChart,
    description:
      'Functional utilitarian design prioritizing practical purpose. Centralizes complex financial management, bank syncing, and line-item OCR extraction into a single neural interface.',
    capabilities: [
      'Automated Bank Sync & Reconciliation',
      'Instant AI Receipt & Invoice OCR Ingestion',
      'Real-time Ledger Balancing & Auditing',
      'Automated Financial Forecast Reporting',
    ],
    accentColor: '#c9a84c',
  },
]

// ── Feature Highlights ──
const FEATURES = [
  {
    icon: Cpu,
    title: 'Neural Compute Engine',
    description:
      'Sub-millisecond decision processing with unthrottled enterprise compute nodes built for scale.',
  },
  {
    icon: Lock,
    title: 'Isolated Secure Sessions',
    description:
      'Bank-grade 256-bit encryption for every workflow session. Enterprise privacy guaranteed by design.',
  },
  {
    icon: Activity,
    title: 'Proactive System Bouncer',
    description:
      'Continuous telemetry monitoring that detects bottlenecks and dispatches agents autonomously.',
  },
  {
    icon: Database,
    title: 'Unified Ledger System',
    description:
      'Seamless multi-database synchronization connecting your tasks, contacts, and financial records.',
  },
]

// ── Pricing Plans (Matched exactly to app/dashboard/billing/page.tsx) ──
const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    priceUSD: '$19',
    tagline: 'For growing SMEs',
    features: [
      '50 Daily Tasks',
      'Basic COO Kanban',
      'Manual CFO Uploads',
      'Email support',
      '2 team seats',
    ],
  },
  {
    key: 'professional',
    name: 'Professional',
    priceUSD: '$99',
    tagline: 'Most powerful for teams',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Unlimited Oracle Credits',
      'Automated CFO Bank Sync',
      'Proactive Agent Alerts',
      'Priority support',
      '10 team seats',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    priceUSD: 'Contact Team',
    tagline: 'Unlimited scale',
    features: [
      'Unlimited Neural Compute',
      'Custom API Generation',
      'Dedicated Support',
      'Unlimited team seats',
      'Custom SLA',
    ],
  },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    <div className="min-h-screen bg-[#0b1929] text-[#f0f4f8] font-sans selection:bg-[#c9a84c]/30 selection:text-[#f0f4f8] overflow-x-hidden">
      {/* ── HEADER / NAVIGATION ── */}
      <header className="sticky top-0 z-50 bg-[#0b1929]/90 backdrop-blur-md border-b border-[#c9a84c]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#9c7d35] p-0.5 flex items-center justify-center shadow-lg shadow-[#c9a84c]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b1929] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#c9a84c]" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#f0f4f8] group-hover:text-[#c9a84c] transition-colors">
                ZENO<span className="text-[#c9a84c]"> OS</span>
              </span>
              <span className="block text-[10px] font-mono text-[#7a95b0] uppercase tracking-widest -mt-1">
                Neural Business System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#c0cdd8] hover:text-[#c9a84c] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Header Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#c0cdd8] hover:text-[#f0f4f8] px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c9a84c] hover:bg-[#d4b560] text-[#0b1929] text-sm font-bold shadow-lg shadow-[#c9a84c]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Initialize Session
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#7a95b0] hover:text-[#f0f4f8] hover:bg-[#0f2035]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f2035] border-b border-[#c9a84c]/15 px-4 pt-4 pb-6 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-[#c0cdd8] hover:text-[#c9a84c] py-2"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-[#162c45] flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-[#f0f4f8] bg-[#162c45] rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-bold text-[#0b1929] bg-[#c9a84c] rounded-xl"
              >
                Initialize Session
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9a84c]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#20b2aa]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0f2035] border border-[#c9a84c]/30 text-xs font-mono text-[#c9a84c] shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
              <span>ZENO OS // NEURAL ENGINE V2.6 ONLINE</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#f0f4f8] text-balance leading-[1.1]">
              Enterprise-Grade <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#c9a84c] via-[#e5c770] to-[#c9a84c] bg-clip-text text-transparent">
                Neural Business Operating System
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#7a95b0] max-w-3xl mx-auto font-normal leading-relaxed text-balance">
              An enterprise-grade neural business operating system designed for centralized workspace management.
              Initialize secure sessions within a specialized environment.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#c9a84c] hover:bg-[#d4b560] text-[#0b1929] text-base font-bold shadow-xl shadow-[#c9a84c]/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5" />
                Initialize Session
              </Link>
              <a
                href="#architecture"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0f2035] hover:bg-[#162c45] text-[#f0f4f8] text-base font-semibold border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all flex items-center justify-center gap-2"
              >
                View Architecture
                <ChevronRight className="w-4 h-4 text-[#7a95b0]" />
              </a>
            </div>
          </div>

          {/* Neural Terminal / Interface Graphic Preview */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="rounded-2xl bg-[#0f2035] border border-[#c9a84c]/25 p-4 sm:p-6 shadow-2xl shadow-black/80 backdrop-blur-xl">
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between border-b border-[#162c45] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#e05252]" />
                  <div className="w-3 h-3 rounded-full bg-[#e0a052]" />
                  <div className="w-3 h-3 rounded-full bg-[#4a9c5d]" />
                  <span className="ml-2 text-xs font-mono text-[#7a95b0]">
                    zeno-os // neural-workspace-terminal
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-[#c9a84c]">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>3/3 AGENTS ACTIVE</span>
                </div>
              </div>

              {/* Terminal Content Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Agent Card 1 */}
                <div className="p-4 rounded-xl bg-[#0b1929] border border-[#c9a84c]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#c9a84c] uppercase">Oracle Agent</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#4a9c5d]/10 text-[#4a9c5d] border border-[#4a9c5d]/20">
                      LEAD DISCOVERY
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#c0cdd8]">Scanned 1,420 domain profiles. Found 84 high-intent prospects.</p>
                  <div className="w-full bg-[#162c45] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#c9a84c] h-full w-[84%]" />
                  </div>
                </div>

                {/* Agent Card 2 */}
                <div className="p-4 rounded-xl bg-[#0b1929] border border-[#20b2aa]/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#20b2aa] uppercase">COO Agent</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#20b2aa]/10 text-[#20b2aa] border border-[#20b2aa]/20">
                      KANBAN AUTO
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#c0cdd8]">Dispatched 12 sprint tasks. 0 workflow bottlenecks detected.</p>
                  <div className="w-full bg-[#162c45] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#20b2aa] h-full w-[100%]" />
                  </div>
                </div>

                {/* Agent Card 3 */}
                <div className="p-4 rounded-xl bg-[#0b1929] border border-[#c9a84c]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#c9a84c] uppercase">CFO Agent</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#4a9c5d]/10 text-[#4a9c5d] border border-[#4a9c5d]/20">
                      OCR INGEST
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#c0cdd8]">Processed 18 bank statements. Ledger balanced &amp; reconciled.</p>
                  <div className="w-full bg-[#162c45] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#c9a84c] h-full w-[92%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20 bg-[#0f2035]/60 border-y border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-mono text-[#c9a84c] uppercase tracking-widest">
              Core Platform Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-[#f0f4f8]">
              Centralized Neural Infrastructure for Modern Enterprises
            </p>
            <p className="text-base text-[#7a95b0]">
              Built ground-up with autonomous agent orchestration, secure environment isolation, and real-time execution pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feat) => {
              const Icon = feat.icon
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-2xl bg-[#0b1929] border border-[#162c45] hover:border-[#c9a84c]/30 transition-all hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#162c45] flex items-center justify-center mb-5 text-[#c9a84c] group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#f0f4f8] mb-2">{feat.title}</h3>
                  <p className="text-sm text-[#7a95b0] leading-relaxed">{feat.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── NEURAL AGENTS SECTION (AGENTS) ── */}
      <section id="agents" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE THREE NEURAL AGENTS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f0f4f8]">
              Autonomous Executive Suite
            </h2>
            <p className="text-base sm:text-lg text-[#7a95b0]">
              Oracle, COO, and CFO work seamlessly together inside your workspace to automate growth, operations, and finance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {AGENTS.map((agent) => {
              const Icon = agent.icon
              const isTeal = agent.accentColor === '#20b2aa'
              return (
                <div
                  key={agent.id}
                  className="flex flex-col justify-between p-8 rounded-2xl bg-[#0f2035] border transition-all duration-300 relative group overflow-hidden"
                  style={{
                    borderColor: isTeal ? 'rgba(32,178,170,0.3)' : 'rgba(201,168,76,0.2)',
                  }}
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className="text-xs font-mono font-bold px-3 py-1 rounded-md"
                        style={{
                          background: isTeal ? 'rgba(32,178,170,0.1)' : 'rgba(201,168,76,0.1)',
                          color: isTeal ? '#20b2aa' : '#c9a84c',
                          border: `1px solid ${isTeal ? 'rgba(32,178,170,0.3)' : 'rgba(201,168,76,0.3)'}`,
                        }}
                      >
                        {agent.moduleNumber}
                      </span>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: isTeal ? 'rgba(32,178,170,0.15)' : 'rgba(201,168,76,0.15)',
                          color: isTeal ? '#20b2aa' : '#c9a84c',
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-[#f0f4f8] mb-1">{agent.name}</h3>
                    <p className="text-xs font-mono mb-4" style={{ color: isTeal ? '#20b2aa' : '#c9a84c' }}>
                      {agent.role}
                    </p>
                    <p className="text-sm text-[#7a95b0] mb-6 leading-relaxed">{agent.description}</p>

                    {/* Capability List */}
                    <div className="space-y-3 pt-4 border-t border-[#162c45]">
                      {agent.capabilities.map((cap) => (
                        <div key={cap} className="flex items-start gap-2.5 text-xs text-[#c0cdd8]">
                          <Check
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: isTeal ? '#20b2aa' : '#c9a84c' }}
                          />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-8 pt-6 border-t border-[#162c45]">
                    <Link
                      href="/login"
                      className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all"
                      style={{
                        background: isTeal ? 'rgba(32,178,170,0.12)' : 'rgba(201,168,76,0.12)',
                        color: isTeal ? '#20b2aa' : '#c9a84c',
                        border: `1px solid ${isTeal ? 'rgba(32,178,170,0.3)' : 'rgba(201,168,76,0.3)'}`,
                      }}
                    >
                      Deploy {agent.name}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE SECTION ── */}
      <section id="architecture" className="py-20 bg-[#0f2035]/80 border-y border-[#c9a84c]/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Technical Registry Specs */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162c45] border border-[#c9a84c]/20 text-xs font-mono text-[#c9a84c]">
                <Terminal className="w-3.5 h-3.5" />
                <span>SYSTEM REGISTRY &amp; SPECS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f4f8]">
                Enterprise Hardware &amp; Neural Specifications
              </h2>
              <p className="text-base text-[#7a95b0] leading-relaxed">
                Zeno OS is structured with a modular architecture to enforce tenant isolation, automated audit logging,
                and sub-millisecond dispatch times across multi-region edge deployments.
              </p>

              {/* Spec Registry Table */}
              <div className="rounded-xl bg-[#0b1929] border border-[#162c45] overflow-hidden text-xs font-mono">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#162c45] bg-[#0f2035]/50">
                  <span className="text-[#7a95b0]">Product Registry Title</span>
                  <span className="text-[#f0f4f8] font-bold">ZENO OS</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#162c45]">
                  <span className="text-[#7a95b0]">Classification Tier</span>
                  <span className="text-[#c9a84c] font-bold">Premium Enterprise</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#162c45]">
                  <span className="text-[#7a95b0]">Functional Focus</span>
                  <span className="text-[#20b2aa] font-bold">Utility / Ops Management</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[#7a95b0]">Session Architecture</span>
                  <span className="text-[#4a9c5d] font-bold">256-Bit Isolated Neural Pods</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Architecture Visual */}
            <div className="p-8 rounded-2xl bg-[#0b1929] border border-[#c9a84c]/25 space-y-6">
              <div className="flex items-center justify-between border-b border-[#162c45] pb-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#c9a84c]" />
                  <span className="text-sm font-bold text-[#f0f4f8]">Neural Workspace Environment</span>
                </div>
                <span className="text-xs font-mono text-[#4a9c5d]">HEALTH: 100% OK</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#0f2035] border border-[#162c45] flex items-center justify-between">
                  <span className="text-[#7a95b0]">Identity Provider:</span>
                  <span className="text-[#f0f4f8]">Supabase SSR Auth</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0f2035] border border-[#162c45] flex items-center justify-between">
                  <span className="text-[#7a95b0]">Edge Gatekeeper:</span>
                  <span className="text-[#f0f4f8]">Next.js Middleware Bouncer</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0f2035] border border-[#162c45] flex items-center justify-between">
                  <span className="text-[#7a95b0]">OCR Processing Engine:</span>
                  <span className="text-[#c9a84c]">Gemini Vision Neural Pipeline</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0f2035] border border-[#162c45] flex items-center justify-between">
                  <span className="text-[#7a95b0]">Payment Gateway:</span>
                  <span className="text-[#20b2aa]">Paystack Integrated Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-mono text-[#c9a84c] uppercase tracking-widest">
              Simple &amp; Transparent Pricing
            </h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-[#f0f4f8]">
              Choose the Plan That Fits Your Scale
            </p>
            <p className="text-base text-[#7a95b0]">
              No hidden fees. Billed monthly. Upgrade or downgrade anytime directly in your workspace settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PLANS.map((plan) => {
              const isPro = plan.key === 'professional'
              const isEnterprise = plan.key === 'enterprise'

              return (
                <div
                  key={plan.key}
                  className="flex flex-col justify-between p-8 rounded-2xl bg-[#0f2035] relative transition-all duration-300"
                  style={{
                    background: isPro
                      ? 'rgba(32,178,170,0.06)'
                      : 'rgba(15,32,53,0.9)',
                    border: isPro
                      ? '2px solid rgba(32,178,170,0.7)'
                      : '1px solid rgba(201,168,76,0.15)',
                    boxShadow: isPro ? '0 0 40px rgba(32,178,170,0.15)' : 'none',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="flex items-center gap-1 px-4 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-gradient-to-r from-[#c9a84c] to-[#9c7d35] text-[#0b1929] shadow-lg shadow-[#c9a84c]/30">
                        <Star className="w-3 h-3 fill-current" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-xl font-bold"
                        style={{ color: isPro ? '#20b2aa' : '#f0f4f8' }}
                      >
                        {plan.name}
                      </h3>
                    </div>
                    <p className="text-xs font-mono text-[#7a95b0] mb-6">{plan.tagline}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[#162c45]">
                      <span
                        className="text-4xl font-extrabold"
                        style={{ color: isPro ? '#20b2aa' : '#c9a84c' }}
                      >
                        {plan.priceUSD}
                      </span>
                      {plan.priceUSD !== 'Contact Team' && (
                        <span className="text-xs font-mono text-[#7a95b0]">/month</span>
                      )}
                    </div>

                    {/* Features checklist */}
                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-xs text-[#c0cdd8]">
                          <Check
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: isPro ? '#20b2aa' : '#c9a84c' }}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Action */}
                  <div>
                    {isEnterprise ? (
                      <a
                        href="mailto:info@jrdigitalhubltd.com?subject=Zeno%20OS%20Enterprise%20Enquiry"
                        className="w-full py-3.5 rounded-xl text-xs font-mono font-bold text-center block transition-all bg-[#162c45] hover:bg-[#1c3959] text-[#20b2aa] border border-[#20b2aa]/40"
                      >
                        Contact Enterprise Team
                      </a>
                    ) : (
                      <Link
                        href="/login"
                        className="w-full py-3.5 rounded-xl text-xs font-mono font-bold text-center block transition-all"
                        style={
                          isPro
                            ? {
                                background: '#c9a84c',
                                color: '#0b1929',
                                boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
                              }
                            : {
                                background: 'rgba(201,168,76,0.15)',
                                color: '#c9a84c',
                                border: '1px solid rgba(201,168,76,0.4)',
                              }
                        }
                      >
                        Get Started with {plan.name}
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0b1929] border-t border-[#c9a84c]/15 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand Info */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c9a84c] flex items-center justify-center text-[#0b1929]">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-[#f0f4f8]">
                  ZENO<span className="text-[#c9a84c]"> OS</span>
                </span>
              </div>
              <p className="text-xs text-[#7a95b0] max-w-md leading-relaxed">
                Enterprise-grade neural business operating system designed for centralized workspace management,
                autonomous lead generation, and financial OCR intelligence.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <p className="text-xs font-mono text-[#c9a84c]">
                  A product of JR Digital Hub LTD.
                </p>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0f2035] hover:bg-[#162c45] border border-[#c9a84c]/30 text-xs font-mono text-[#f0f4f8] transition-colors group"
                  title="Copy support email"
                >
                  <Mail className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span>ceo@jrdigitalhubltd.com</span>
                  <Copy className="w-3 h-3 text-[#7a95b0] group-hover:text-[#c9a84c] transition-colors" />
                </button>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-3 text-xs">
              <p className="font-mono text-[#f0f4f8] uppercase font-bold tracking-wider">Navigation</p>
              <ul className="space-y-2 text-[#7a95b0]">
                <li><a href="#features" className="hover:text-[#c9a84c] transition-colors">Features</a></li>
                <li><a href="#agents" className="hover:text-[#c9a84c] transition-colors">Neural Agents</a></li>
                <li><a href="#architecture" className="hover:text-[#c9a84c] transition-colors">Architecture</a></li>
                <li><a href="#pricing" className="hover:text-[#c9a84c] transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Column 3: Legal & Support */}
            <div className="space-y-3 text-xs">
              <p className="font-mono text-[#f0f4f8] uppercase font-bold tracking-wider">Legal &amp; Support</p>
              <ul className="space-y-2 text-[#7a95b0]">
                <li><Link href="/privacy" className="hover:text-[#c9a84c] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#c9a84c] transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-[#c9a84c] transition-colors">Security Architecture</Link></li>
                <li>
                  <a href="mailto:ceo@jrdigitalhubltd.com" className="hover:text-[#c9a84c] transition-colors">
                    ceo@jrdigitalhubltd.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright bar */}
          <div className="pt-8 border-t border-[#162c45] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#7a95b0] gap-4">
            <p>ZENO OS // JR DIGITAL HUB LTD. ALL RIGHTS RESERVED.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4a9c5d]" />
              SYSTEM STATUS: 100% OPERATIONAL
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
