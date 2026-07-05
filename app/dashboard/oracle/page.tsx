'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { buildPolarUrl, POLAR_CHECKOUT_IDS } from '@/lib/polar-config'
import { useAppContext } from '@/context/AppContext'
import DirectAgentTerminal from '@/components/direct-agent-terminal'
import { apiClient } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import {
  Search,
  X,
  Mail,
  Globe,
  Building2,
  User,
  ChevronRight,
  Loader2,
  Zap,
  AlertTriangle,
  Check,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type Lead = {
  id: number
  company: string
  contact: string
  role: string
  domain: string
  status: 'Verified' | 'Unverified' | 'Enriched'
  score: number
}

type DraftModalState = {
  open: boolean
  lead: Lead | null
}

// ── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Lead['status'] }) {
  const map: Record<Lead['status'], { bg: string; color: string }> = {
    Verified:   { bg: 'rgba(74,156,93,0.12)',   color: '#4a9c5d' },
    Enriched:   { bg: 'rgba(201,168,76,0.12)',  color: '#c9a84c' },
    Unverified: { bg: 'rgba(122,149,176,0.12)', color: '#7a95b0' },
  }
  const s = map[status]
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  )
}

// ── Score bar ──────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? '#c9a84c' : score >= 75 ? '#4a9c5d' : '#7a95b0'
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 w-20 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-mono" style={{ color }}>
        {score}
      </span>
    </div>
  )
}

// ── Draft email modal ──────────────────────────────────────────────────────

function DraftModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const subject = `Partnership Opportunity — Zeno OS x ${lead.company}`
  const body = `Hi ${lead.contact.split(' ')[0]},

I came across ${lead.company} (${lead.domain}) and wanted to reach out directly to you as ${lead.role}.

We are building Zeno OS — a Neural Business Operating System that helps companies like yours automate operations, accelerate growth, and gain real-time financial clarity through AI agents.

Given your focus area, I believe there is a strong alignment worth exploring. Would you be open to a 20-minute conversation this week?

Best regards,
Zeno OS Team`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{
          background: '#0f2035',
          border: '1px solid rgba(201,168,76,0.2)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}
        >
          <div className="flex items-center gap-2.5">
            <Mail size={15} style={{ color: '#c9a84c' }} />
            <span className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
              Draft Email — {lead.contact}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors"
            style={{ color: '#7a95b0' }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
              To
            </label>
            <div
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.15)',
                color: '#c0cdd8',
                fontFamily: 'monospace',
              }}
            >
              {lead.contact.toLowerCase().replace(' ', '.')}@{lead.domain}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
              Subject
            </label>
            <div
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.15)',
                color: '#c0cdd8',
              }}
            >
              {subject}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
              Body
            </label>
            <textarea
              defaultValue={body}
              rows={9}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none outline-none transition-colors"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.15)',
                color: '#c0cdd8',
                fontFamily: 'monospace',
                lineHeight: '1.6',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)')}
            />
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              color: '#7a95b0',
              border: '1px solid rgba(122,149,176,0.2)',
            }}
          >
            Discard
          </button>
          <button
            className="px-5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: '#c9a84c',
              color: '#0b1929',
            }}
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Oracle Pricing Modal (lightweight, self-contained) ─────────────────────
// Mirrors the global 3-tier pricing matrix from /dashboard/billing exactly.

type Region = 'nigeria' | 'world'
type ModalStep = 'pricing' | 'checkout' | 'success'

const ORACLE_PLANS = [
  {
    key: 'starter' as const,
    name: 'Starter',
    priceUSD: '$19',
    priceNGN: '₦14,999',
    tagline: 'For growing SMEs',
    highlighted: false,
    badge: undefined as string | undefined,
    features: ['50 Daily Tasks', 'Basic COO Kanban', 'Manual CFO Uploads', 'Email support', '2 team seats'],
  },
  {
    key: 'professional' as const,
    name: 'Professional',
    priceUSD: '$99',
    priceNGN: '₦99,999',
    tagline: 'Most powerful for teams',
    highlighted: true,
    badge: 'Most Popular' as string | undefined,
    features: ['Unlimited Oracle Credits', 'Automated CFO Bank Sync', 'Proactive Agent Alerts', 'Priority support', '10 team seats'],
  },
  {
    key: 'enterprise' as const,
    name: 'Enterprise',
    priceUSD: 'Contact Team',
    priceNGN: 'Contact Team',
    tagline: 'Unlimited scale',
    highlighted: false,
    badge: undefined as string | undefined,
    features: ['Unlimited Neural Compute', 'Custom API Generation', 'Dedicated Support', 'Unlimited team seats', 'Custom SLA'],
  },
]

function OraclePricingModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const router = useRouter()
  const [region, setRegion] = useState<Region>('world')
  const [selected, setSelected] = useState(ORACLE_PLANS[1]) // default: Professional
  const [step, setStep] = useState<ModalStep>('pricing')
  const [paying, setPaying] = useState(false)
  const isNigeria = region === 'nigeria'

  async function handlePay() {
    setPaying(true)
    // TODO: integrate Paystack (nigeria) checkout here
    await new Promise((res) => setTimeout(res, 2000))
    setPaying(false)
    setStep('success')
    onSuccess()
  }

  // Workspace ID — real value injected by backend auth; placeholder until then
  const { user, walletLoading } = useAppContext()
  const workspaceId = user?.workspace_id

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(11,25,41,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && step !== 'success' && onClose()}
    >
      <div
        className="w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#0d1e30',
          border: '1px solid rgba(201,168,76,0.22)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          maxHeight: '92vh',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(201,168,76,0.12)' }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
              {step === 'pricing' ? 'Upgrade to Continue' : step === 'checkout' ? 'Checkout' : 'Payment Confirmed'}
            </p>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>
              {step === 'pricing'
                ? 'Unlock unlimited Oracle Neural Compute.'
                : step === 'checkout'
                ? `${selected.name} · Monthly · ${isNigeria ? selected.priceNGN : selected.priceUSD}`
                : 'Oracle credits are now unlimited.'}
            </p>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg"
              style={{ color: '#7a95b0' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0f4f8')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Pricing step */}
        {step === 'pricing' && (
          <div className="overflow-auto">
            {/* Geo toggle */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'rgba(201,168,76,0.1)' }}
            >
              <span className="text-xs font-mono" style={{ color: '#7a95b0' }}>Billing Region</span>
              <div
                className="flex items-center gap-1 p-1 rounded-xl"
                style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.15)' }}
              >
                {(['world', 'nigeria'] as Region[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: region === r ? 'rgba(201,168,76,0.18)' : 'transparent',
                      color: region === r ? '#c9a84c' : '#7a95b0',
                      border: region === r ? '1px solid rgba(201,168,76,0.35)' : '1px solid transparent',
                    }}
                  >
                    {r === 'nigeria' ? 'Nigeria (₦)' : 'Rest of World ($)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan cards — 3-tier grid matching global pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
              {ORACLE_PLANS.map((plan) => {
                const isSel = selected.key === plan.key
                const isPro = plan.key === 'professional'
                const displayPrice = isNigeria ? plan.priceNGN : plan.priceUSD
                const isContact = displayPrice === 'Contact Team'
                return (
                  <button
                    key={plan.key}
                    onClick={() => setSelected(plan)}
                    className="flex flex-col gap-3 p-5 rounded-xl text-left transition-all relative"
                    style={{
                      background: isPro
                        ? isSel ? 'rgba(32,178,170,0.08)' : 'rgba(32,178,170,0.04)'
                        : isSel ? 'rgba(201,168,76,0.07)' : 'rgba(201,168,76,0.02)',
                      border: isPro
                        ? `1.5px solid ${isSel ? 'rgba(32,178,170,0.8)' : 'rgba(32,178,170,0.45)'}`
                        : `1px solid ${isSel ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)'}`,
                      boxShadow: isPro ? '0 0 30px rgba(32,178,170,0.1)' : 'none',
                    }}
                  >
                    {/* Most Popular badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span
                          className="flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider whitespace-nowrap"
                          style={{
                            background: 'linear-gradient(135deg, #c9a84c, #a88030)',
                            color: '#0b1929',
                            boxShadow: '0 2px 12px rgba(201,168,76,0.4)',
                          }}
                        >
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold" style={{ color: isPro ? '#20b2aa' : '#f0f4f8' }}>{plan.name}</p>
                        <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>{plan.tagline}</p>
                      </div>
                      {isSel && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isPro ? 'rgba(32,178,170,0.2)' : 'rgba(201,168,76,0.2)',
                            border: `1px solid ${isPro ? '#20b2aa' : '#c9a84c'}`,
                          }}
                        >
                          <Check size={11} style={{ color: isPro ? '#20b2aa' : '#c9a84c' }} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold" style={{ color: isPro ? '#20b2aa' : '#c9a84c' }}>
                        {displayPrice}
                      </span>
                      {!isContact && (
                        <span className="text-xs font-mono pb-0.5" style={{ color: '#7a95b0' }}>/mo</span>
                      )}
                    </div>

                    <ul className="flex flex-col gap-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check size={11} style={{ color: isPro ? '#20b2aa' : '#c9a84c', marginTop: 3, flexShrink: 0 }} />
                          <span className="text-[12px] font-mono" style={{ color: '#c0cdd8' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>

            <div className="px-6 pb-6 flex flex-col gap-3">
              {selected.key === 'enterprise' ? (
                // Enterprise: launch native mail client
                <a
                  href="mailto:info@jrdigitalhubltd.com?subject=Zeno%20OS%20Enterprise%20Enquiry"
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all text-center"
                  style={{
                    background: 'rgba(32,178,170,0.12)',
                    border: '1.5px solid rgba(32,178,170,0.45)',
                    color: '#20b2aa',
                    display: 'block',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = 'rgba(32,178,170,0.22)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = 'rgba(32,178,170,0.12)')
                  }
                >
                  Contact Our Enterprise Team
                </a>
              ) : (
                // Starter / Professional — redirect to Polar checkout
                isNigeria ? (
                  // Nigeria: keep internal checkout flow (Paystack)
                    <button
                      onClick={() => setStep('checkout')}
                      className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                      style={
                        selected.key === 'professional'
                          ? { background: '#c9a84c', color: '#0b1929', boxShadow: '0 4px 20px rgba(201,168,76,0.3)' }
                          : { background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.5)', color: '#c9a84c' }
                      }
                      onMouseEnter={(e) => {
                        if (selected.key === 'professional') {
                          (e.currentTarget as HTMLElement).style.background = '#d4b560'
                        } else {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.3)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selected.key === 'professional') {
                          (e.currentTarget as HTMLElement).style.background = '#c9a84c'
                        } else {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)'
                        }
                      }}
                    >
                      Select {selected.name}
                    </button>
                  ) : (
                    // Rest of World: open Polar checkout in new tab with workspace_id
                    walletLoading ? (
                      <button
                        disabled
                        className="w-full py-3 rounded-xl text-sm font-bold opacity-60 cursor-not-allowed flex items-center justify-center gap-2"
                        style={
                          selected.key === 'professional'
                            ? { background: '#c9a84c', color: '#0b1929', boxShadow: '0 4px 20px rgba(201,168,76,0.3)' }
                            : { background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.5)', color: '#c9a84c' }
                        }
                      >
                        <Loader2 size={16} className="animate-spin" />
                        Loading...
                      </button>
                    ) : !workspaceId ? (
                      <button
                        disabled
                        className="w-full py-3 rounded-xl text-sm font-bold opacity-60 cursor-not-allowed text-center block"
                        style={
                          selected.key === 'professional'
                            ? { background: '#c9a84c', color: '#0b1929', boxShadow: '0 4px 20px rgba(201,168,76,0.3)' }
                            : { background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.5)', color: '#c9a84c' }
                        }
                      >
                        Workspace ID Missing
                      </button>
                    ) : (
                      <a
                        id={`oracle-polar-checkout-${selected.key}`}
                        href={
                          selected.key === 'starter'
                            ? `${POLAR_CHECKOUT_IDS.starter}?workspace_id=${workspaceId}`
                            : `${POLAR_CHECKOUT_IDS.professional}?workspace_id=${workspaceId}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl text-sm font-bold transition-all text-center block"
                        style={
                          selected.key === 'professional'
                            ? { background: '#c9a84c', color: '#0b1929', boxShadow: '0 4px 20px rgba(201,168,76,0.3)' }
                            : { background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.5)', color: '#c9a84c' }
                        }
                        onMouseEnter={(e) => {
                          if (selected.key === 'professional') {
                            (e.currentTarget as HTMLElement).style.background = '#d4b560'
                          } else {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.3)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selected.key === 'professional') {
                            (e.currentTarget as HTMLElement).style.background = '#c9a84c'
                          } else {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)'
                          }
                        }}
                      >
                        Checkout with Polar →
                      </a>
                    )
                  )
              )}
              <p className="text-center text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                {selected.key === 'enterprise'
                  ? 'Custom contracts, SLAs, and onboarding available.'
                  : 'No contracts. Cancel any time. Billed monthly.'}
              </p>
            </div>
          </div>
        )}

        {/* Checkout step */}
        {step === 'checkout' && (
          <div className="overflow-auto flex flex-col gap-0">
            <div
              className="mx-6 mt-6 rounded-xl p-5 flex flex-col gap-4"
              style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}
            >
              <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>Order Summary</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold" style={{ color: '#f0f4f8' }}>Zeno OS {selected.name}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>Billing Cycle: Monthly</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: '#c9a84c' }}>
                    {isNigeria ? selected.priceNGN : selected.priceUSD}
                  </p>
                  <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>per month</p>
                </div>
              </div>
              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
                <span className="text-xs font-mono" style={{ color: '#7a95b0' }}>Payment via</span>
                <span
                  className="text-xs font-semibold font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: isNigeria ? 'rgba(0,123,63,0.12)' : 'rgba(122,149,176,0.1)',
                    color: isNigeria ? '#4a9c5d' : '#c0cdd8',
                    border: `1px solid ${isNigeria ? 'rgba(0,123,63,0.25)' : 'rgba(122,149,176,0.2)'}`,
                  }}
                >
                  {isNigeria ? 'Paystack' : 'Polar'}
                </span>
              </div>
            </div>
            <div className="px-6 mt-6 pb-6 flex flex-col gap-3">
              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-70"
                style={isNigeria
                  ? { background: paying ? 'rgba(0,123,63,0.4)' : '#007b3f', color: '#fff', border: '1px solid rgba(0,123,63,0.4)' }
                  : { background: paying ? 'rgba(15,32,53,0.9)' : '#111d2b', color: '#f0f4f8', border: '1px solid rgba(201,168,76,0.25)' }
                }
              >
                {paying ? (
                  <><Loader2 size={15} className="animate-spin" /> Processing...</>
                ) : isNigeria ? (
                  <><ShieldCheck size={15} /> Pay securely with Paystack</>
                ) : (
                  <><ShieldCheck size={15} /> Checkout securely via Polar</>
                )}
              </button>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck size={12} style={{ color: '#7a95b0' }} />
                <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                  Secure 256-bit encryption. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success step */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center gap-5 px-6 py-14">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(74,156,93,0.12)', border: '2px solid rgba(74,156,93,0.35)' }}
            >
              <CheckCircle2 size={32} style={{ color: '#4a9c5d' }} />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: '#f0f4f8' }}>Welcome to Zeno Pro</p>
              <p className="text-xs font-mono mt-1.5 max-w-xs" style={{ color: '#7a95b0' }}>
                Oracle credits are now unlimited. All research targets are unthrottled.
              </p>
            </div>
            <button
              onClick={() => { onClose(); router.push('/dashboard') }}
              className="px-8 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.28)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.18)')}
            >
              Return to Command Center
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

const INITIAL_CREDITS = 3

export default function OraclePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [leads, setLeads] = useState<Lead[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [modal, setModal] = useState<DraftModalState>({ open: false, lead: null })

  // Credit counter
  const [credits, setCredits] = useState(INITIAL_CREDITS)
  const [upgraded, setUpgraded] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)

  const creditsExhausted = credits <= 0 && !upgraded

  async function handleSearch() {
    if (!query.trim() || creditsExhausted) return
    
    setLoading(true)
    setLeads([])
    setProgress(5)
    setHasSearched(true)

    // Simulate progress updates during active network request
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p
        return p + Math.random() * 10
      })
    }, 150)

    try {
      if (!upgraded) setCredits((c) => Math.max(0, c - 1))
      const data = await apiClient.post<Lead[]>('/api/v1/oracle/scan', { query })
      clearInterval(interval)
      setProgress(100)
      
      // Delay slightly so user sees 100% before it hides
      await new Promise((r) => setTimeout(r, 300))
      setLeads(data)
    } catch (err: any) {
      clearInterval(interval)
      toast({
        variant: 'error',
        title: 'Error qualified leads',
        description: err instanceof Error ? err.message : 'Failed to scan domain.',
      })
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  function openDraft(lead: Lead) {
    setModal({ open: true, lead })
  }

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* ── 70% main content ── */}
      <div className="flex-1 overflow-y-auto min-w-0">
      {modal.open && modal.lead && (
        <DraftModal lead={modal.lead} onClose={() => setModal({ open: false, lead: null })} />
      )}
      {pricingOpen && (
        <OraclePricingModal
          onClose={() => setPricingOpen(false)}
          onSuccess={() => { setUpgraded(true); setPricingOpen(false) }}
        />
      )}

      <div className="p-6 max-w-6xl mx-auto">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Search size={16} style={{ color: '#c9a84c' }} />
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
                Oracle · Research Engine
              </span>
            </div>
            <h1 className="text-xl font-semibold text-balance" style={{ color: '#f0f4f8' }}>
              Lead Intelligence
            </h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
              Enter a target domain or keyword to discover and enrich leads.
            </p>
          </div>
          {/* Credit counter */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
            style={{
              background: creditsExhausted
                ? 'rgba(224,82,82,0.1)'
                : upgraded
                ? 'rgba(74,156,93,0.1)'
                : credits <= 1
                ? 'rgba(224,160,82,0.1)'
                : 'rgba(201,168,76,0.08)',
              border: `1px solid ${creditsExhausted ? 'rgba(224,82,82,0.3)' : upgraded ? 'rgba(74,156,93,0.3)' : credits <= 1 ? 'rgba(224,160,82,0.3)' : 'rgba(201,168,76,0.2)'}`,
            }}
          >
            <Zap
              size={13}
              style={{ color: creditsExhausted ? '#e05252' : upgraded ? '#4a9c5d' : credits <= 1 ? '#e0a052' : '#c9a84c' }}
            />
            <span
              className="text-xs font-mono font-semibold"
              style={{ color: creditsExhausted ? '#e05252' : upgraded ? '#4a9c5d' : credits <= 1 ? '#e0a052' : '#c9a84c' }}
            >
              {upgraded ? 'Unlimited' : `${credits} credit${credits !== 1 ? 's' : ''} left`}
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex gap-3 mb-6 p-4 rounded-xl"
          style={{
            background: '#0f2035',
            border: '1px solid rgba(201,168,76,0.15)',
          }}
        >
          <div className="flex-1 relative">
            <Globe
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: '#7a95b0' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSearch()
              }}
              placeholder="e.g. saas fintech london or techcrunch.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.18)',
                color: '#f0f4f8',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)')}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim() || creditsExhausted}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: creditsExhausted ? 'rgba(224,82,82,0.15)' : '#c9a84c', color: creditsExhausted ? '#e05252' : '#0b1929' }}
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <ChevronRight size={15} />
            )}
            {loading ? 'Researching…' : 'Start Research'}
          </button>
        </div>

        {/* Paywall banner */}
        {creditsExhausted && (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 rounded-xl"
            style={{
              background: 'rgba(224,82,82,0.07)',
              border: '1px solid rgba(224,82,82,0.3)',
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} style={{ color: '#e05252', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
                  You have exhausted your free Neural Compute credits.
                </p>
                <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
                  Upgrade to Zeno Pro to unlock unlimited Oracle research runs.
                </p>
              </div>
            </div>
            <button
              onClick={() => setPricingOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 transition-all"
              style={{
                background: 'rgba(201,168,76,0.18)',
                border: '1px solid rgba(201,168,76,0.45)',
                color: '#c9a84c',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.3)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.18)')}
            >
              <Zap size={14} />
              Upgrade to Continue
            </button>
          </div>
        )}

        {/* Progress bar */}
        {loading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
                Scanning targets…
              </span>
              <span className="text-[10px] font-mono" style={{ color: '#c9a84c' }}>
                {Math.min(100, Math.round(progress))}%
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, progress)}%`,
                  background: 'linear-gradient(90deg, #9c7d35, #c9a84c)',
                }}
              />
            </div>
          </div>
        )}

        {/* Results table */}
        {leads.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              border: '1px solid rgba(201,168,76,0.15)',
            }}
          >
            {/* Table header */}
            <div
              className="grid gap-4 px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider"
              style={{
                background: '#0f2035',
                color: '#7a95b0',
                gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr auto',
                borderBottom: '1px solid rgba(201,168,76,0.1)',
              }}
            >
              <span className="flex items-center gap-1.5"><Building2 size={10} /> Company</span>
              <span className="flex items-center gap-1.5"><User size={10} /> Contact</span>
              <span>Domain</span>
              <span>Status</span>
              <span>Score</span>
              <span>Action</span>
            </div>

            {/* Table rows */}
            {leads.map((lead, i) => (
              <div
                key={lead.id}
                className="grid gap-4 px-4 py-3.5 items-center transition-colors"
                style={{
                  gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr auto',
                  background: i % 2 === 0 ? '#0d1e30' : 'rgba(15,32,53,0.6)',
                  borderBottom: i < leads.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none',
                }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: '#f0f4f8' }}>
                    {lead.company}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#c0cdd8' }}>
                    {lead.contact}
                  </p>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>
                    {lead.role}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                    {lead.domain}
                  </span>
                </div>
                <div>
                  <StatusBadge status={lead.status} />
                </div>
                <div>
                  <ScoreBar score={lead.score} />
                </div>
                <div>
                  <button
                    onClick={() => openDraft(lead)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                    style={{
                      background: 'rgba(201,168,76,0.1)',
                      color: '#c9a84c',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)'
                    }}
                  >
                    <Mail size={11} />
                    Draft Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {hasSearched && !loading && leads.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-xl"
            style={{ border: '1px dashed rgba(201,168,76,0.15)' }}
          >
            <Search size={32} style={{ color: 'rgba(201,168,76,0.3)' }} />
            <p className="mt-3 text-sm font-mono" style={{ color: '#7a95b0' }}>
              No results found. Try a different query.
            </p>
          </div>
        )}

        {!hasSearched && (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-xl"
            style={{ border: '1px dashed rgba(201,168,76,0.12)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
            >
              <Globe size={20} style={{ color: '#c9a84c' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#c0cdd8' }}>
              Ready to research
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: '#7a95b0' }}>
              Enter a domain or keyword above to begin lead discovery.
            </p>
          </div>
        )}
      </div>
      </div>

      {/* ── 30% terminal ── */}
      <div className="w-[30%] flex-shrink-0">
        <DirectAgentTerminal agentRole="Oracle" />
      </div>
    </div>
  )
}
