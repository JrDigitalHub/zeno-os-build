'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle2, Brain, Briefcase, BarChart3 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

const INDUSTRIES = [
  'Technology & SaaS',
  'Financial Services',
  'Healthcare & Life Sciences',
  'Legal & Professional Services',
  'E-commerce & Retail',
  'Manufacturing & Logistics',
  'Real Estate',
  'Consulting & Advisory',
  'Media & Marketing',
  'Other',
]

const AGENTS = [
  {
    id: 'oracle',
    name: 'Oracle',
    subtitle: 'Lead Generation',
    description:
      'Autonomously scans the web, qualifies leads, and enriches your CRM pipeline with high-intent prospects.',
    icon: Brain,
  },
  {
    id: 'coo',
    name: 'COO',
    subtitle: 'Operations & Kanban',
    description:
      'Manages task routing, team workflows, and operational bottlenecks across your entire organization.',
    icon: Briefcase,
  },
  {
    id: 'cfo',
    name: 'CFO',
    subtitle: 'Financial Ledger',
    description:
      'Tracks cash flow, automates bookkeeping, and surfaces financial anomalies in real time.',
    icon: BarChart3,
  },
]

const BOOT_LINES = [
  { delay: 0, text: 'Initializing Zeno OS kernel...', status: 'ok' },
  { delay: 600, text: 'Booting Unified Neural Infrastructure...', status: 'ok' },
  { delay: 1200, text: 'Provisioning multi-tenant workspace...', status: 'ok' },
  { delay: 1800, text: 'Connecting to Go backend cluster...', status: 'ok' },
  { delay: 2400, text: 'Oracle agent connected.', status: 'agent' },
  { delay: 3000, text: 'COO agent connected.', status: 'agent' },
  { delay: 3600, text: 'CFO agent connected.', status: 'agent' },
  { delay: 4200, text: 'Securing enterprise TLS channel...', status: 'ok' },
  { delay: 4800, text: 'Neural mesh synchronized.', status: 'ok' },
  { delay: 5400, text: '> All systems operational. Launching Command Center...', status: 'final' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1 state
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [targetAudience, setTargetAudience] = useState('')

  // Step 2 state
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])

  // Step 3 state
  const [terminalLines, setTerminalLines] = useState<{ text: string; status: 'ok' | 'agent' | 'final' | 'error' }[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (step !== 3) return

    const timers: ReturnType<typeof setTimeout>[] = []

    const bootSequence0_3 = [
      { text: 'Initializing Zeno OS kernel...', status: 'ok' as const },
      { text: 'Booting Unified Neural Infrastructure...', status: 'ok' as const },
      { text: 'Provisioning multi-tenant workspace...', status: 'ok' as const },
      { text: 'Connecting to Go backend cluster...', status: 'ok' as const },
    ]

    bootSequence0_3.forEach((line, index) => {
      const t = setTimeout(() => {
        setTerminalLines((prev) => [...prev, line])

        if (index === 3) {
          apiClient
            .get<any>('/api/v1/wallet')
            .then(() => {
              const bootSequence4_9 = [
                { text: 'Oracle agent connected.', status: 'agent' as const },
                { text: 'COO agent connected.', status: 'agent' as const },
                { text: 'CFO agent connected.', status: 'agent' as const },
                { text: 'Securing enterprise TLS channel...', status: 'ok' as const },
                { text: 'Neural mesh synchronized.', status: 'ok' as const },
                { text: '> All systems operational. Launching Command Center...', status: 'final' as const },
              ]

              bootSequence4_9.forEach((l, i) => {
                const tSub = setTimeout(() => {
                  setTerminalLines((prev) => [...prev, l])
                }, (i + 1) * 600)
                timers.push(tSub)
              })

              const tDone = setTimeout(() => {
                setDone(true)
              }, 4000)
              timers.push(tDone)

              const tRedirect = setTimeout(() => {
                router.push('/dashboard')
              }, 5400)
              timers.push(tRedirect)
            })
            .catch((err) => {
              const errMsg = err instanceof Error ? err.message : 'Database trigger timeout.'
              setTerminalLines((prev) => [
                ...prev,
                { text: `[ ERROR ] Connection failed: ${errMsg}`, status: 'error' as const },
                { text: 'Halted boot sequence. Please try refreshing or verify system status.', status: 'error' as const },
              ])
              setDone(true)
            })
        }
      }, index * 600)
      timers.push(t)
    })

    return () => timers.forEach(clearTimeout)
  }, [step, router])

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  const canProceedStep1 = companyName.trim() && industry && targetAudience.trim()
  const canProceedStep2 = selectedAgents.length > 0

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo row */}
        <div className="flex items-center gap-3 mb-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zeno-logo-lkiAE73bRovt0MDeLabqYwMQSuit6L.png"
            alt="Zeno OS"
            width={32}
            height={32}
          />
          <span
            className="text-sm font-mono uppercase tracking-widest"
            style={{ color: '#c9a84c' }}
          >
            Zeno OS
          </span>
        </div>

        {/* Step indicator */}
        {step < 3 && (
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-all"
                  style={{
                    background: step >= s ? '#c9a84c' : 'rgba(201,168,76,0.1)',
                    color: step >= s ? '#0b1929' : '#7a95b0',
                    border: step >= s ? 'none' : '1px solid rgba(201,168,76,0.2)',
                  }}
                >
                  {step > s ? <CheckCircle2 size={14} /> : s}
                </div>
                {s < 2 && (
                  <div
                    className="w-16 h-px"
                    style={{
                      background: step > s ? '#c9a84c' : 'rgba(201,168,76,0.2)',
                    }}
                  />
                )}
              </div>
            ))}
            <span className="ml-2 text-xs font-mono" style={{ color: '#7a95b0' }}>
              Step {step} of 2
            </span>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div
            className="bg-card rounded-xl p-8 border"
            style={{ borderColor: 'rgba(201,168,76,0.18)' }}
          >
            <h2 className="text-2xl font-semibold mb-1" style={{ color: '#f0f4f8' }}>
              Business Context
            </h2>
            <p className="text-sm mb-7" style={{ color: '#7a95b0' }}>
              The Neural Engine needs context to calibrate your AI agents.
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: '#f0f4f8',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.5)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.2)' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
                  Industry Domain
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: industry ? '#f0f4f8' : '#7a95b0',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.5)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.2)' }}
                >
                  <option value="" disabled style={{ background: '#0f2035' }}>
                    Select your industry
                  </option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind} style={{ background: '#0f2035', color: '#f0f4f8' }}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
                  Target Audience / Core Service
                </label>
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Describe your primary customers and the core service your business delivers..."
                  rows={4}
                  className="w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all resize-none leading-relaxed"
                  style={{
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: '#f0f4f8',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.5)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.2)' }}
                />
              </div>
            </div>

            <div className="mt-7 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="px-7 py-2.5 rounded-md text-sm font-mono font-semibold uppercase tracking-widest transition-all"
                style={{
                  background: canProceedStep1 ? '#c9a84c' : 'rgba(201,168,76,0.2)',
                  color: canProceedStep1 ? '#0b1929' : '#7a95b0',
                  cursor: canProceedStep1 ? 'pointer' : 'not-allowed',
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div
            className="bg-card rounded-xl p-8 border"
            style={{ borderColor: 'rgba(201,168,76,0.18)' }}
          >
            <h2 className="text-2xl font-semibold mb-1" style={{ color: '#f0f4f8' }}>
              Activate AI Agents
            </h2>
            <p className="text-sm mb-7" style={{ color: '#7a95b0' }}>
              Select the neural agents to deploy within your operating system.
            </p>

            <div className="flex flex-col gap-4">
              {AGENTS.map((agent) => {
                const isSelected = selectedAgents.includes(agent.id)
                const Icon = agent.icon
                return (
                  <button
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className="text-left rounded-xl p-5 border transition-all"
                    style={{
                      background: isSelected ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.03)',
                      borderColor: isSelected ? '#c9a84c' : 'rgba(201,168,76,0.15)',
                      boxShadow: isSelected ? '0 0 16px rgba(201,168,76,0.1)' : 'none',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: isSelected ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.07)',
                        }}
                      >
                        <Icon
                          size={20}
                          style={{ color: isSelected ? '#c9a84c' : '#7a95b0' }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-semibold text-sm"
                            style={{ color: isSelected ? '#c9a84c' : '#f0f4f8' }}
                          >
                            {agent.name}
                          </span>
                          <span
                            className="text-xs font-mono px-2 py-0.5 rounded-full"
                            style={{
                              background: 'rgba(201,168,76,0.1)',
                              color: '#c9a84c',
                            }}
                          >
                            {agent.subtitle}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#7a95b0' }}>
                          {agent.description}
                        </p>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all"
                        style={{
                          borderColor: isSelected ? '#c9a84c' : 'rgba(201,168,76,0.3)',
                          background: isSelected ? '#c9a84c' : 'transparent',
                        }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-7 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 rounded-md text-sm font-mono uppercase tracking-widest transition-all"
                style={{
                  background: 'transparent',
                  color: '#7a95b0',
                  border: '1px solid rgba(201,168,76,0.15)',
                }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="px-7 py-2.5 rounded-md text-sm font-mono font-semibold uppercase tracking-widest transition-all"
                style={{
                  background: canProceedStep2 ? '#c9a84c' : 'rgba(201,168,76,0.2)',
                  color: canProceedStep2 ? '#0b1929' : '#7a95b0',
                  cursor: canProceedStep2 ? 'pointer' : 'not-allowed',
                }}
              >
                Initialize
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Terminal */}
        {step === 3 && (
          <div
            className="bg-card rounded-xl border overflow-hidden"
            style={{ borderColor: 'rgba(201,168,76,0.2)' }}
          >
            {/* Terminal title bar */}
            <div
              className="flex items-center gap-2 px-5 py-3 border-b"
              style={{ background: '#0b1929', borderColor: 'rgba(201,168,76,0.12)' }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#e05252' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#c9a84c' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#4a9c5d' }} />
              <span className="ml-3 text-xs font-mono" style={{ color: '#7a95b0' }}>
                zeno-os — boot sequence
              </span>
            </div>

            {/* Terminal body */}
            <div className="px-6 py-6 min-h-72 font-mono text-sm">
              <p className="mb-3" style={{ color: '#c9a84c' }}>
                $ zeno boot --workspace=&quot;{companyName || 'enterprise'}&quot;
              </p>
              <div className="flex flex-col gap-1.5">
                {terminalLines.map((line, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 transition-all"
                    style={{
                      opacity: 1,
                      transform: 'translateY(0)',
                      transitionDuration: '300ms',
                    }}
                  >
                    {line.status !== 'final' && (
                      <span
                        className="text-xs mt-0.5 flex-shrink-0"
                        style={{
                          color: line.status === 'error' ? '#e05252' : line.status === 'agent' ? '#4a9c5d' : '#c9a84c',
                        }}
                      >
                        {line.status === 'error' ? '[FAIL ]' : line.status === 'agent' ? '[AGENT]' : '[ OK  ]'}
                      </span>
                    )}
                    <span
                      style={{
                        color: line.status === 'error'
                          ? '#e05252'
                          : line.status === 'final'
                          ? '#c9a84c'
                          : line.status === 'agent'
                          ? '#4a9c5d'
                          : '#c0cdd8',
                        fontWeight: line.status === 'final' ? 600 : 400,
                      }}
                    >
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>

              {done && (
                <div className="mt-4 flex items-center gap-2">
                  <span style={{ color: '#c9a84c' }}>$</span>
                  <span className="cursor-blink" style={{ color: '#c9a84c' }}>
                    _
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
