'use client'

import { useState, useMemo } from 'react'
import { BookOpen, ArrowDownLeft, ArrowUpRight, Filter, TrendingUp, TrendingDown, Wallet } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type TxType = 'incoming' | 'outgoing'

type Transaction = {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: TxType
}

// ── Seed data ──────────────────────────────────────────────────────────────

const ALL_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-0041', date: 'Jun 30, 2026', description: 'Enterprise license — Apex Systems',    category: 'Revenue',    amount: 12400,  type: 'incoming' },
  { id: 'TXN-0040', date: 'Jun 29, 2026', description: 'Cloud infrastructure (Vercel)',        category: 'Ops',        amount: -2300,  type: 'outgoing' },
  { id: 'TXN-0039', date: 'Jun 28, 2026', description: 'Consulting retainer — Meridian',      category: 'Revenue',    amount: 8750,   type: 'incoming' },
  { id: 'TXN-0038', date: 'Jun 27, 2026', description: 'Payroll disbursement — June',         category: 'Payroll',    amount: -18500, type: 'outgoing' },
  { id: 'TXN-0037', date: 'Jun 26, 2026', description: 'Oracle module subscription × 12',     category: 'Revenue',    amount: 4800,   type: 'incoming' },
  { id: 'TXN-0036', date: 'Jun 25, 2026', description: 'Legal fees — ToS revision',           category: 'Legal',      amount: -3200,  type: 'outgoing' },
  { id: 'TXN-0035', date: 'Jun 24, 2026', description: 'SaaS tooling (Notion, Linear, Figma)', category: 'Software',  amount: -940,   type: 'outgoing' },
  { id: 'TXN-0034', date: 'Jun 23, 2026', description: 'SME partnership revenue — Nova',      category: 'Revenue',    amount: 6200,   type: 'incoming' },
  { id: 'TXN-0033', date: 'Jun 22, 2026', description: 'Marketing & paid acquisition',        category: 'Marketing',  amount: -5100,  type: 'outgoing' },
  { id: 'TXN-0032', date: 'Jun 21, 2026', description: 'Annual insurance premium',            category: 'Insurance',  amount: -1800,  type: 'outgoing' },
  { id: 'TXN-0031', date: 'Jun 20, 2026', description: 'Beta revenue — Helix Industries',     category: 'Revenue',    amount: 3300,   type: 'incoming' },
  { id: 'TXN-0030', date: 'Jun 19, 2026', description: 'R&D contractor — AI pipeline',        category: 'R&D',        amount: -7600,  type: 'outgoing' },
  { id: 'TXN-0029', date: 'Jun 18, 2026', description: 'Lumen Ventures pilot deal',           category: 'Revenue',    amount: 9100,   type: 'incoming' },
  { id: 'TXN-0028', date: 'Jun 17, 2026', description: 'Office & equipment costs',            category: 'Ops',        amount: -1200,  type: 'outgoing' },
  { id: 'TXN-0027', date: 'Jun 16, 2026', description: 'Grant — SME Innovation Fund',         category: 'Grant',      amount: 15000,  type: 'incoming' },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(Math.abs(n))
}

// ── Summary card ───────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
}: {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  color: string
  bg: string
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: '#0f2035',
        border: '1px solid rgba(201,168,76,0.13)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: bg }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-semibold font-mono" style={{ color }}>
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: '#7a95b0' }}>
        {sub}
      </p>
    </div>
  )
}

// ── Filter pill ────────────────────────────────────────────────────────────

type FilterType = 'all' | 'incoming' | 'outgoing'

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
        color: active ? '#c9a84c' : '#7a95b0',
        border: `1px solid ${active ? 'rgba(201,168,76,0.35)' : 'rgba(122,149,176,0.15)'}`,
      }}
    >
      {label}
    </button>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function FinancialsPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const visible = useMemo(
    () =>
      filter === 'all'
        ? ALL_TRANSACTIONS
        : ALL_TRANSACTIONS.filter((t) => t.type === filter),
    [filter]
  )

  const totalBalance = useMemo(
    () => visible.reduce((sum, t) => sum + t.amount, 0),
    [visible]
  )

  const totalIncoming = useMemo(
    () => visible.filter((t) => t.type === 'incoming').reduce((sum, t) => sum + t.amount, 0),
    [visible]
  )

  const totalOutgoing = useMemo(
    () => visible.filter((t) => t.type === 'outgoing').reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [visible]
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} style={{ color: '#c9a84c' }} />
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
            CFO · Financial Ledger
          </span>
        </div>
        <h1 className="text-xl font-semibold text-balance" style={{ color: '#f0f4f8' }}>
          Cash Flow & Transactions
        </h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
          Showing {visible.length} of {ALL_TRANSACTIONS.length} transactions
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          label="Net Balance"
          value={`${totalBalance >= 0 ? '+' : '-'}${fmt(totalBalance)}`}
          sub={`Based on ${visible.length} visible transactions`}
          icon={Wallet}
          color={totalBalance >= 0 ? '#c9a84c' : '#e05252'}
          bg={totalBalance >= 0 ? 'rgba(201,168,76,0.1)' : 'rgba(224,82,82,0.1)'}
        />
        <SummaryCard
          label="Total Incoming"
          value={`+${fmt(totalIncoming)}`}
          sub={`${visible.filter((t) => t.type === 'incoming').length} inbound transactions`}
          icon={TrendingUp}
          color="#4a9c5d"
          bg="rgba(74,156,93,0.1)"
        />
        <SummaryCard
          label="Total Outgoing"
          value={`-${fmt(totalOutgoing)}`}
          sub={`${visible.filter((t) => t.type === 'outgoing').length} outbound transactions`}
          icon={TrendingDown}
          color="#e05252"
          bg="rgba(224,82,82,0.1)"
        />
      </div>

      {/* Ledger table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(201,168,76,0.15)' }}
      >
        {/* Table controls */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{
            background: '#0f2035',
            borderColor: 'rgba(201,168,76,0.1)',
          }}
        >
          <div className="flex items-center gap-2">
            <Filter size={13} style={{ color: '#7a95b0' }} />
            <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
              Filter
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FilterPill label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterPill label="Incoming" active={filter === 'incoming'} onClick={() => setFilter('incoming')} />
            <FilterPill label="Outgoing" active={filter === 'outgoing'} onClick={() => setFilter('outgoing')} />
          </div>
        </div>

        {/* Column headers */}
        <div
          className="grid px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider"
          style={{
            background: '#0f2035',
            color: '#7a95b0',
            gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
            borderBottom: '1px solid rgba(201,168,76,0.08)',
          }}
        >
          <span>Txn ID</span>
          <span>Date</span>
          <span>Description</span>
          <span>Category</span>
          <span className="text-right">Amount</span>
        </div>

        {/* Rows */}
        {visible.map((tx, i) => {
          const isIn = tx.type === 'incoming'
          return (
            <div
              key={tx.id}
              className="grid px-5 py-3.5 items-center transition-colors"
              style={{
                gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
                background: i % 2 === 0 ? '#0d1e30' : 'rgba(15,32,53,0.55)',
                borderBottom: i < visible.length - 1 ? '1px solid rgba(201,168,76,0.05)' : 'none',
              }}
            >
              {/* Txn ID */}
              <span className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                {tx.id}
              </span>

              {/* Date */}
              <span className="text-xs" style={{ color: '#c0cdd8' }}>
                {tx.date}
              </span>

              {/* Description */}
              <span className="text-xs font-medium pr-4 truncate" style={{ color: '#f0f4f8' }}>
                {tx.description}
              </span>

              {/* Category */}
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full w-fit"
                style={{
                  background: 'rgba(122,149,176,0.1)',
                  color: '#7a95b0',
                }}
              >
                {tx.category}
              </span>

              {/* Amount */}
              <div className="flex items-center justify-end gap-1.5">
                {isIn ? (
                  <ArrowDownLeft size={12} style={{ color: '#4a9c5d', flexShrink: 0 }} />
                ) : (
                  <ArrowUpRight size={12} style={{ color: '#e05252', flexShrink: 0 }} />
                )}
                <span
                  className="text-sm font-semibold font-mono"
                  style={{ color: isIn ? '#4a9c5d' : '#e05252' }}
                >
                  {isIn ? '+' : '-'}{fmt(tx.amount)}
                </span>
              </div>
            </div>
          )
        })}

        {/* Empty state */}
        {visible.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16"
            style={{ background: '#0d1e30' }}
          >
            <BookOpen size={28} style={{ color: 'rgba(201,168,76,0.25)' }} />
            <p className="mt-3 text-xs font-mono" style={{ color: '#7a95b0' }}>
              No transactions match the current filter.
            </p>
          </div>
        )}

        {/* Totals footer */}
        <div
          className="grid px-5 py-3.5 items-center border-t"
          style={{
            gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
            background: '#0f2035',
            borderColor: 'rgba(201,168,76,0.1)',
          }}
        >
          <span />
          <span />
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
            Net Total ({visible.length} records)
          </span>
          <span />
          <span
            className="text-sm font-semibold font-mono text-right"
            style={{ color: totalBalance >= 0 ? '#c9a84c' : '#e05252' }}
          >
            {totalBalance >= 0 ? '+' : '-'}{fmt(totalBalance)}
          </span>
        </div>
      </div>
    </div>
  )
}
