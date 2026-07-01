'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  Zap,
  FileText,
  Download,
  X,
  Check,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type Region = 'nigeria' | 'world'
type PlanKey = 'starter' | 'enterprise'
type ModalStep = 'pricing' | 'checkout' | 'success'

interface Invoice {
  id: string
  date: string
  description: string
  amount: string
  status: 'Paid' | 'Pending'
}

interface Plan {
  key: PlanKey
  name: string
  priceUSD: string
  priceNGN: string
  tagline: string
  features: string[]
}

// ── Constants ──────────────────────────────────────────────────────────────

const INVOICES: Invoice[] = [
  { id: 'INV-0041', date: '01 Jun 2026', description: 'Zeno OS Metered Trial — May 2026',  amount: '$0.00',   status: 'Paid'    },
  { id: 'INV-0035', date: '01 May 2026', description: 'Zeno OS Metered Trial — Apr 2026',  amount: '$0.00',   status: 'Paid'    },
  { id: 'INV-0029', date: '01 Apr 2026', description: 'Zeno OS Metered Trial — Mar 2026',  amount: '$0.00',   status: 'Paid'    },
  { id: 'INV-0022', date: '01 Mar 2026', description: 'Zeno OS Metered Trial — Feb 2026',  amount: '$18.40',  status: 'Pending' },
]

const PLANS: Plan[] = [
  {
    key: 'starter',
    name: 'Starter',
    priceUSD: '$49',
    priceNGN: '₦75,000',
    tagline: 'For growing SMEs',
    features: [
      '500 Oracle Compute Credits/mo',
      'Basic COO Kanban automation',
      'CFO Ledger ingestion (20 uploads)',
      'Email support',
      '3 team seats',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    priceUSD: '$199',
    priceNGN: '₦300,000',
    tagline: 'Unlimited scale',
    features: [
      'Unlimited Oracle Compute Credits',
      'Priority neural processing',
      'Advanced CFO forecasting & automation',
      'Dedicated account manager',
      'Unlimited team seats',
      'Custom API rate limits',
    ],
  },
]

// ── Usage bar ──────────────────────────────────────────────────────────────

function UsageBar({
  label,
  used,
  total,
  unit,
  unlimited = false,
}: {
  label: string
  used: number
  total: number
  unit: string
  unlimited?: boolean
}) {
  const pct = Math.min((used / total) * 100, 100)
  const danger = pct >= 80

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: '#c0cdd8' }}>
          {label}
        </span>
        <span className="text-xs font-mono" style={{ color: unlimited ? '#4a9c5d' : danger ? '#e0a052' : '#7a95b0' }}>
          {unlimited ? 'Unlimited Active' : `${used} / ${total} ${unit}`}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 7, background: 'rgba(122,149,176,0.15)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: unlimited ? '100%' : `${pct}%`,
            background: unlimited
              ? 'linear-gradient(90deg, #2d8b4e, #4a9c5d)'
              : danger
              ? 'linear-gradient(90deg, #e0a052, #e05252)'
              : 'linear-gradient(90deg, #c9a84c, #a88030)',
          }}
        />
      </div>
      <p className="text-[11px] font-mono" style={{ color: unlimited ? '#4a9c5d' : '#7a95b0' }}>
        {unlimited ? 'Unlimited Compute Active' : `${(100 - pct).toFixed(0)}% remaining`}
      </p>
    </div>
  )
}

// ── Pricing Modal ──────────────────────────────────────────────────────────

function PricingModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const router = useRouter()
  const [region, setRegion] = useState<Region>('world')
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1]) // default Enterprise
  const [step, setStep] = useState<ModalStep>('pricing')
  const [paying, setPaying] = useState(false)

  const isNigeria = region === 'nigeria'
  const price = isNigeria ? selectedPlan.priceNGN : selectedPlan.priceUSD
  const period = isNigeria ? '/mo' : '/mo'

  async function handlePay() {
    setPaying(true)
    // TODO: integrate Paystack (nigeria) or Polar (world) checkout here
    await new Promise((res) => setTimeout(res, 2000))
    setPaying(false)
    setStep('success')
    onSuccess()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(11,25,41,0.9)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && step !== 'success' && onClose()}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#0d1e30',
          border: '1px solid rgba(201,168,76,0.22)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          maxHeight: '92vh',
        }}
      >
        {/* ── Modal header ── */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(201,168,76,0.12)' }}
        >
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                onClick={() => setStep('pricing')}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                style={{ color: '#7a95b0', border: '1px solid rgba(122,149,176,0.2)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0f4f8')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
              >
                <ChevronLeft size={15} />
              </button>
            )}
            <div>
              <p className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
                {step === 'pricing' ? 'Upgrade Zeno OS' : step === 'checkout' ? 'Checkout' : 'Payment Confirmed'}
              </p>
              <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>
                {step === 'pricing'
                  ? 'Choose the plan that fits your business.'
                  : step === 'checkout'
                  ? `${selectedPlan.name} · Monthly · ${price}${period}`
                  : 'Your subscription is now active.'}
              </p>
            </div>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
              style={{ color: '#7a95b0' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0f4f8')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Step: Pricing ── */}
        {step === 'pricing' && (
          <div className="overflow-auto flex flex-col">
            {/* Geo toggle */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'rgba(201,168,76,0.1)' }}
            >
              <span className="text-xs font-mono" style={{ color: '#7a95b0' }}>
                Billing Region
              </span>
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

            {/* Plan cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan.key === plan.key
                const displayPrice = isNigeria ? plan.priceNGN : plan.priceUSD
                return (
                  <button
                    key={plan.key}
                    onClick={() => setSelectedPlan(plan)}
                    className="flex flex-col gap-4 p-5 rounded-xl text-left transition-all"
                    style={{
                      background: isSelected ? 'rgba(201,168,76,0.07)' : 'rgba(201,168,76,0.02)',
                      border: plan.key === 'enterprise'
                        ? `1px solid ${isSelected ? '#c9a84c' : 'rgba(201,168,76,0.35)'}`
                        : `1px solid ${isSelected ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)'}`,
                      boxShadow: plan.key === 'enterprise' ? '0 0 24px rgba(201,168,76,0.08)' : 'none',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold" style={{ color: '#f0f4f8' }}>
                            {plan.name}
                          </p>
                          {plan.key === 'enterprise' && (
                            <span
                              className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}
                            >
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>
                          {plan.tagline}
                        </p>
                      </div>
                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid #c9a84c' }}
                        >
                          <Check size={11} style={{ color: '#c9a84c' }} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold" style={{ color: '#c9a84c' }}>
                        {displayPrice}
                      </span>
                      <span className="text-xs font-mono pb-0.5" style={{ color: '#7a95b0' }}>
                        /mo
                      </span>
                    </div>

                    <ul className="flex flex-col gap-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check size={11} style={{ color: '#c9a84c', marginTop: 3, flexShrink: 0 }} />
                          <span className="text-[12px] font-mono" style={{ color: '#c0cdd8' }}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>

            <div className="px-6 pb-6 flex flex-col gap-3">
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: 'rgba(201,168,76,0.2)',
                  border: '1px solid rgba(201,168,76,0.5)',
                  color: '#c9a84c',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.3)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)')}
              >
                Select {selectedPlan.name}
              </button>
              <p className="text-center text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                No contracts. Cancel any time. Billed monthly.
              </p>
            </div>
          </div>
        )}

        {/* ── Step: Checkout ── */}
        {step === 'checkout' && (
          <div className="overflow-auto flex flex-col gap-0">
            {/* Order summary */}
            <div
              className="mx-6 mt-6 rounded-xl p-5 flex flex-col gap-4"
              style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}
            >
              <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
                Order Summary
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold" style={{ color: '#f0f4f8' }}>
                    Zeno OS {selectedPlan.name}
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
                    Billing Cycle: Monthly
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: '#c9a84c' }}>
                    {isNigeria ? selectedPlan.priceNGN : selectedPlan.priceUSD}
                  </p>
                  <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                    per month
                  </p>
                </div>
              </div>
              <div
                className="pt-3 border-t flex items-center justify-between"
                style={{ borderColor: 'rgba(201,168,76,0.1)' }}
              >
                <span className="text-xs font-mono" style={{ color: '#7a95b0' }}>
                  Payment via
                </span>
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

            {/* Payment button */}
            <div className="px-6 mt-6 pb-6 flex flex-col gap-3">
              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-70"
                style={
                  isNigeria
                    ? {
                        background: paying ? 'rgba(0,123,63,0.4)' : '#007b3f',
                        color: '#fff',
                        border: '1px solid rgba(0,123,63,0.4)',
                      }
                    : {
                        background: paying ? 'rgba(15,32,53,0.9)' : '#111d2b',
                        color: '#f0f4f8',
                        border: '1px solid rgba(201,168,76,0.25)',
                      }
                }
              >
                {paying ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Processing...
                  </>
                ) : isNigeria ? (
                  <>
                    <ShieldCheck size={15} />
                    Pay securely with Paystack
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    Checkout securely via Polar
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck size={12} style={{ color: '#7a95b0' }} />
                <p className="text-[11px] font-mono text-center" style={{ color: '#7a95b0' }}>
                  Secure 256-bit encryption. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Step: Success ── */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center gap-5 px-6 py-14">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(74,156,93,0.12)', border: '2px solid rgba(74,156,93,0.35)' }}
            >
              <CheckCircle2 size={32} style={{ color: '#4a9c5d' }} />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: '#f0f4f8' }}>
                Welcome to Zeno Pro
              </p>
              <p className="text-xs font-mono mt-1.5 max-w-xs" style={{ color: '#7a95b0' }}>
                Your {selectedPlan.name} plan is active. Unlimited Neural Compute is now unlocked
                across all agents.
              </p>
            </div>
            <div
              className="w-full max-w-xs rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: 'rgba(74,156,93,0.07)', border: '1px solid rgba(74,156,93,0.2)' }}
            >
              <Check size={13} style={{ color: '#4a9c5d', flexShrink: 0 }} />
              <span className="text-xs font-mono" style={{ color: '#c0cdd8' }}>
                Unlimited Compute Active — all agents unthrottled
              </span>
            </div>
            <button
              onClick={() => { onClose(); router.push('/dashboard') }}
              className="px-8 py-3 rounded-xl text-sm font-bold transition-all"
              style={{
                background: 'rgba(201,168,76,0.18)',
                border: '1px solid rgba(201,168,76,0.4)',
                color: '#c9a84c',
              }}
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

// ── Page ──────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [pricingOpen, setPricingOpen] = useState(false)
  const [upgraded, setUpgraded] = useState(false)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {pricingOpen && (
        <PricingModal
          onClose={() => setPricingOpen(false)}
          onSuccess={() => setUpgraded(true)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard size={15} style={{ color: '#c9a84c' }} />
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
            Settings · Billing
          </span>
        </div>
        <h1 className="text-xl font-semibold text-balance" style={{ color: '#f0f4f8' }}>
          Billing & Metered Usage
        </h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
          Monitor your compute consumption and manage your subscription.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Current Plan Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: '#0f2035',
            border: upgraded
              ? '1px solid rgba(74,156,93,0.35)'
              : '1px solid rgba(201,168,76,0.14)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={
                    upgraded
                      ? { background: 'rgba(74,156,93,0.12)', color: '#4a9c5d', border: '1px solid rgba(74,156,93,0.25)' }
                      : { background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }
                  }
                >
                  {upgraded ? 'Active Plan' : 'Current Plan'}
                </span>
              </div>
              <p className="text-xl font-bold" style={{ color: '#f0f4f8' }}>
                {upgraded ? 'Zeno Pro' : 'Metered Trial'}
              </p>
              <p className="text-xs font-mono mt-1" style={{ color: '#7a95b0' }}>
                {upgraded
                  ? 'Unlimited Neural Compute across all agents.'
                  : 'Pay only for what you use. No monthly fee during trial.'}
              </p>
            </div>
            {!upgraded && (
              <button
                onClick={() => setPricingOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold flex-shrink-0 transition-all"
                style={{
                  background: 'rgba(201,168,76,0.18)',
                  border: '1px solid rgba(201,168,76,0.45)',
                  color: '#c9a84c',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.3)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.18)')}
              >
                <Zap size={15} />
                Upgrade to Zeno Pro
              </button>
            )}
          </div>

          {/* Usage bars */}
          <div
            className="mt-6 pt-5 border-t flex flex-col gap-5"
            style={{ borderColor: upgraded ? 'rgba(74,156,93,0.15)' : 'rgba(201,168,76,0.1)' }}
          >
            <UsageBar label="Oracle Compute Credits" used={42} total={100} unit="Credits" unlimited={upgraded} />
            <UsageBar label="COO Automation Runs"    used={17} total={50}  unit="Runs"    unlimited={upgraded} />
            <UsageBar label="CFO Ledger Ingestion"   used={8}  total={10}  unit="Uploads" unlimited={upgraded} />
          </div>
        </div>

        {/* Invoice History */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#0f2035', border: '1px solid rgba(201,168,76,0.14)' }}
        >
          <div
            className="flex items-center gap-2.5 px-6 py-4 border-b"
            style={{ borderColor: 'rgba(201,168,76,0.1)' }}
          >
            <FileText size={15} style={{ color: '#c9a84c' }} />
            <p className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
              Invoice History
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                  {['Invoice', 'Date', 'Description', 'Amount', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-[10px] font-mono uppercase tracking-wider"
                      style={{ color: '#7a95b0' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, i) => (
                  <tr
                    key={inv.id}
                    style={{
                      borderBottom: i < INVOICES.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.02)',
                    }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono" style={{ color: '#c9a84c' }}>{inv.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono" style={{ color: '#c0cdd8' }}>{inv.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs" style={{ color: '#c0cdd8' }}>{inv.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-semibold" style={{ color: '#f0f4f8' }}>{inv.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full"
                        style={{
                          background: inv.status === 'Paid' ? 'rgba(74,156,93,0.12)' : 'rgba(224,160,82,0.12)',
                          color: inv.status === 'Paid' ? '#4a9c5d' : '#e0a052',
                          border: `1px solid ${inv.status === 'Paid' ? 'rgba(74,156,93,0.25)' : 'rgba(224,160,82,0.25)'}`,
                        }}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="flex items-center gap-1 text-[11px] font-mono transition-all"
                        style={{ color: '#7a95b0' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c9a84c')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
                        aria-label={`Download ${inv.id}`}
                      >
                        <Download size={13} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
