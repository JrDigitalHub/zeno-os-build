'use client'

import { useState } from 'react'
import { CreditCard, Zap, FileText, Download, X, Check } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

interface Invoice {
  id: string
  date: string
  description: string
  amount: string
  status: 'Paid' | 'Pending'
}

const INVOICES: Invoice[] = [
  { id: 'INV-0041', date: '01 Jun 2026', description: 'Zeno OS Metered Trial — May 2026', amount: '$0.00', status: 'Paid' },
  { id: 'INV-0035', date: '01 May 2026', description: 'Zeno OS Metered Trial — Apr 2026', amount: '$0.00', status: 'Paid' },
  { id: 'INV-0029', date: '01 Apr 2026', description: 'Zeno OS Metered Trial — Mar 2026', amount: '$0.00', status: 'Paid' },
  { id: 'INV-0022', date: '01 Mar 2026', description: 'Zeno OS Metered Trial — Feb 2026', amount: '$18.40', status: 'Pending' },
]

// ── Usage bar ──────────────────────────────────────────────────────────────

function UsageBar({
  label,
  used,
  total,
  unit,
}: {
  label: string
  used: number
  total: number
  unit: string
}) {
  const pct = Math.min((used / total) * 100, 100)
  const danger = pct >= 80

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: '#c0cdd8' }}>
          {label}
        </span>
        <span className="text-xs font-mono" style={{ color: danger ? '#e0a052' : '#7a95b0' }}>
          {used} / {total} {unit}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 7, background: 'rgba(122,149,176,0.15)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: danger
              ? 'linear-gradient(90deg, #e0a052, #e05252)'
              : 'linear-gradient(90deg, #c9a84c, #a88030)',
          }}
        />
      </div>
      <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
        {(100 - pct).toFixed(0)}% remaining
      </p>
    </div>
  )
}

// ── Pricing modal ──────────────────────────────────────────────────────────

function PricingModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<'starter' | 'enterprise'>('starter')

  const PLANS = [
    {
      key: 'starter' as const,
      name: 'Starter',
      price: '$49',
      period: '/mo',
      tagline: 'For growing SMEs',
      features: [
        '500 Oracle Compute Credits/mo',
        'Full COO Kanban automation',
        'CFO Ledger with bank sync',
        'Email support',
        '3 team seats',
      ],
    },
    {
      key: 'enterprise' as const,
      name: 'Enterprise',
      price: '$199',
      period: '/mo',
      tagline: 'Unlimited scale',
      features: [
        'Unlimited Oracle Compute Credits',
        'Priority neural processing',
        'Advanced CFO forecasting',
        'Dedicated account manager',
        'Unlimited team seats',
        'Custom API rate limits',
      ],
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(11,25,41,0.88)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{
          background: '#0f2035',
          border: '1px solid rgba(201,168,76,0.22)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'rgba(201,168,76,0.12)' }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
              Upgrade Zeno OS
            </p>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>
              Choose the plan that fits your business.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ color: '#7a95b0' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0f4f8')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          {PLANS.map((plan) => {
            const isSelected = selected === plan.key
            return (
              <button
                key={plan.key}
                onClick={() => setSelected(plan.key)}
                className="flex flex-col gap-4 p-5 rounded-xl text-left transition-all"
                style={{
                  background: isSelected ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.02)',
                  border: `1px solid ${isSelected ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)'}`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#f0f4f8' }}>
                      {plan.name}
                    </p>
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

                <div>
                  <span className="text-2xl font-bold" style={{ color: '#c9a84c' }}>
                    {plan.price}
                  </span>
                  <span className="text-xs font-mono ml-1" style={{ color: '#7a95b0' }}>
                    {plan.period}
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

        {/* CTA */}
        <div
          className="px-6 pb-6 flex flex-col gap-3"
        >
          <button
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: 'rgba(201,168,76,0.2)',
              border: '1px solid rgba(201,168,76,0.5)',
              color: '#c9a84c',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.3)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)')
            }
          >
            Upgrade to Zeno {selected === 'starter' ? 'Starter' : 'Enterprise'}
          </button>
          <p className="text-center text-[11px] font-mono" style={{ color: '#7a95b0' }}>
            No contracts. Cancel any time. Billed monthly.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [pricingOpen, setPricingOpen] = useState(false)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {pricingOpen && <PricingModal onClose={() => setPricingOpen(false)} />}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard size={15} style={{ color: '#c9a84c' }} />
          <span
            className="text-[10px] font-mono uppercase tracking-widest"
            style={{ color: '#7a95b0' }}
          >
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
          style={{ background: '#0f2035', border: '1px solid rgba(201,168,76,0.14)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}
                >
                  Current Plan
                </span>
              </div>
              <p className="text-xl font-bold" style={{ color: '#f0f4f8' }}>
                Metered Trial
              </p>
              <p className="text-xs font-mono mt-1" style={{ color: '#7a95b0' }}>
                Pay only for what you use. No monthly fee during trial.
              </p>
            </div>
            <button
              onClick={() => setPricingOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold flex-shrink-0 transition-all"
              style={{
                background: 'rgba(201,168,76,0.18)',
                border: '1px solid rgba(201,168,76,0.45)',
                color: '#c9a84c',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.3)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.18)')
              }
            >
              <Zap size={15} />
              Upgrade to Zeno Pro
            </button>
          </div>

          {/* Usage bars */}
          <div
            className="mt-6 pt-5 border-t flex flex-col gap-5"
            style={{ borderColor: 'rgba(201,168,76,0.1)' }}
          >
            <UsageBar
              label="Oracle Compute Credits"
              used={42}
              total={100}
              unit="Credits"
            />
            <UsageBar
              label="COO Automation Runs"
              used={17}
              total={50}
              unit="Runs"
            />
            <UsageBar
              label="CFO Ledger Ingestion"
              used={8}
              total={10}
              unit="Uploads"
            />
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
                      borderBottom:
                        i < INVOICES.length - 1
                          ? '1px solid rgba(201,168,76,0.06)'
                          : 'none',
                      background:
                        i % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.02)',
                    }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono" style={{ color: '#c9a84c' }}>
                        {inv.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono" style={{ color: '#c0cdd8' }}>
                        {inv.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs" style={{ color: '#c0cdd8' }}>
                        {inv.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-semibold" style={{ color: '#f0f4f8' }}>
                        {inv.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            inv.status === 'Paid'
                              ? 'rgba(74,156,93,0.12)'
                              : 'rgba(224,160,82,0.12)',
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
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.color = '#c9a84c')
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.color = '#7a95b0')
                        }
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
