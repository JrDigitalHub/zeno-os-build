export const dynamic = 'force-dynamic';
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import {
  Zap,
  DollarSign,
  Cpu,
  Globe,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OracleStatus {
  targets: { domain: string; status: string; leads: number }[]
  totalLeads: number
  activeScans: number
}

interface CooStatus {
  tasks: { id: string; title: string; team: string; status: string; priority: string }[]
}

interface CfoStatus {
  balance: number
  inflow: number
  outflow: number
  transactions: { label: string; amount: number; date: string; type: 'credit' | 'debit' }[]
}

// ─── Stub data (replace with real API calls) ──────────────────────────────────

const ORACLE_STUB: OracleStatus = {
  totalLeads: 347,
  activeScans: 4,
  targets: [
    { domain: 'techcrunch.com', status: 'scanning', leads: 28 },
    { domain: 'linkedin.com/feed', status: 'active', leads: 142 },
    { domain: 'g2.com/categories/crm', status: 'active', leads: 91 },
    { domain: 'producthunt.com', status: 'queued', leads: 0 },
  ],
}

const COO_STUB: CooStatus = {
  tasks: [
    { id: 'T-091', title: 'Q3 Sales Outreach Pipeline Review', team: 'Sales', status: 'in_progress', priority: 'high' },
    { id: 'T-092', title: 'Vendor Contract Renewal — AWS', team: 'Ops', status: 'pending', priority: 'medium' },
    { id: 'T-093', title: 'Onboarding Workflow Automation', team: 'Product', status: 'completed', priority: 'high' },
    { id: 'T-094', title: 'ISO 27001 Audit Preparation', team: 'Compliance', status: 'in_progress', priority: 'critical' },
    { id: 'T-095', title: 'Team Capacity Planning — H2', team: 'HR', status: 'pending', priority: 'low' },
  ],
}

const CFO_STUB: CfoStatus = {
  balance: 284_950.0,
  inflow: 128_400.0,
  outflow: 51_200.0,
  transactions: [
    { label: 'Enterprise SaaS License — ClientCo', amount: 18_000, date: 'Jun 28', type: 'credit' },
    { label: 'AWS Infrastructure — Jun', amount: 9_420, date: 'Jun 27', type: 'debit' },
    { label: 'Retainer Payment — Consulting', amount: 24_000, date: 'Jun 26', type: 'credit' },
    { label: 'Payroll Processing — Jun', amount: 38_500, date: 'Jun 25', type: 'debit' },
  ],
}

// ─── Helper components ────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  trend?: 'up' | 'down'
}) {
  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-3"
      style={{
        background: '#0f2035',
        borderColor: 'rgba(201,168,76,0.15)',
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(201,168,76,0.1)' }}
        >
          <Icon size={16} style={{ color: '#c9a84c' }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold" style={{ color: '#f0f4f8' }}>
          {value}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          {trend === 'up' && <TrendingUp size={11} style={{ color: '#4a9c5d' }} />}
          {trend === 'down' && <TrendingDown size={11} style={{ color: '#e05252' }} />}
          <p className="text-xs font-mono" style={{ color: '#7a95b0' }}>
            {sub}
          </p>
        </div>
      </div>
    </div>
  )
}

function PanelHeader({
  title,
  badge,
  onViewAll,
}: {
  title: string
  badge?: string
  onViewAll?: () => void
}) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 border-b"
      style={{ borderColor: 'rgba(201,168,76,0.1)' }}
    >
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
          {title}
        </p>
        {badge && (
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c' }}
          >
            {badge}
          </span>
        )}
      </div>
      <button
        onClick={onViewAll}
        className="flex items-center gap-1 text-xs font-mono transition-all"
        style={{ color: '#7a95b0' }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = '#c9a84c'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = '#7a95b0'
        }}
      >
        View all <ChevronRight size={12} />
      </button>
    </div>
  )
}

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  scanning: { color: '#c9a84c', label: 'Scanning' },
  active: { color: '#4a9c5d', label: 'Active' },
  queued: { color: '#7a95b0', label: 'Queued' },
  in_progress: { color: '#c9a84c', label: 'In Progress' },
  pending: { color: '#7a95b0', label: 'Pending' },
  completed: { color: '#4a9c5d', label: 'Completed' },
  critical: { color: '#e05252', label: 'Critical' },
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: '#e05252',
  high: '#c9a84c',
  medium: '#7a95b0',
  low: '#4a6b8a',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommandCenterPage() {
  const router = useRouter()

  // ── Oracle data ──────────────────────────────────────────────────────────
  // TODO: Wire to Go backend → GET /api/v1/oracle/status
  const [oracleData, setOracleData] = useState<OracleStatus | null>(null)

  // ── COO data ─────────────────────────────────────────────────────────────
  // TODO: Wire to Go backend → GET /api/v1/coo/tasks
  const [cooData, setCooData] = useState<CooStatus | null>(null)

  // ── CFO data ─────────────────────────────────────────────────────────────
  // TODO: Wire to Go backend → GET /api/v1/cfo/ledger
  const [cfoData, setCfoData] = useState<CfoStatus | null>(null)

  useEffect(() => {
    let cancelled = false

    apiClient
      .get<OracleStatus>('/api/v1/oracle/status')
      .then((data) => {
        if (!cancelled) setOracleData(data)
      })
      .catch(() => {
        if (!cancelled) setOracleData(ORACLE_STUB)
      })

    apiClient
      .get<CooStatus>('/api/v1/coo/tasks')
      .then((data) => {
        if (!cancelled) setCooData(data)
      })
      .catch(() => {
        if (!cancelled) setCooData(COO_STUB)
      })

    apiClient
      .get<CfoStatus>('/api/v1/cfo/ledger')
      .then((data) => {
        if (!cancelled) setCfoData(data)
      })
      .catch(() => {
        if (!cancelled) setCfoData(CFO_STUB)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: '#f0f4f8' }}>
          Command Center
        </h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
          Real-time view across all neural agents · Updated{' '}
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* ── Metric row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="Active Automations"
          value={oracleData ? `${oracleData.activeScans + 3}` : '—'}
          sub="+2 since last session"
          icon={Zap}
          trend="up"
        />
        <MetricCard
          label="Ledger Balance"
          value={cfoData ? formatCurrency(cfoData.balance) : '—'}
          sub={cfoData ? `+${formatCurrency(cfoData.inflow - cfoData.outflow)} net this month` : ''}
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          label="System Compute"
          value="94%"
          sub="Neural mesh utilization"
          icon={Cpu}
        />
      </div>

      {/* ── Neural Engine Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Oracle Panel */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: '#0f2035', borderColor: 'rgba(201,168,76,0.15)' }}
        >
          <PanelHeader
            title="Oracle"
            badge={oracleData ? `${oracleData.totalLeads} leads` : undefined}
            onViewAll={() => router.push('/dashboard/oracle')}
          />
          <div className="p-4 flex flex-col gap-2">
            {/* Summary */}
            <div
              className="flex items-center gap-3 rounded-lg px-4 py-3 mb-1"
              style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}
            >
              <Activity size={14} style={{ color: '#c9a84c' }} />
              <p className="text-xs font-mono" style={{ color: '#c0cdd8' }}>
                {oracleData ? `${oracleData.activeScans} active scans · ${oracleData.totalLeads} total leads captured` : 'Loading...'}
              </p>
            </div>

            {/* Targets */}
            <p className="text-[10px] font-mono uppercase tracking-widest px-1 mb-1" style={{ color: 'rgba(122,149,176,0.5)' }}>
              Web Targets
            </p>
            {(oracleData?.targets ?? Array(4).fill(null)).map((target, i) =>
              target ? (
                <div
                  key={target.domain}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                  style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe size={12} style={{ color: '#7a95b0', flexShrink: 0 }} />
                    <span className="text-xs font-mono truncate" style={{ color: '#c0cdd8' }}>
                      {target.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {target.leads > 0 && (
                      <span className="text-[10px] font-mono" style={{ color: '#c9a84c' }}>
                        {target.leads}
                      </span>
                    )}
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{
                        background: `${STATUS_STYLES[target.status]?.color}18`,
                        color: STATUS_STYLES[target.status]?.color,
                      }}
                    >
                      {STATUS_STYLES[target.status]?.label}
                    </span>
                  </div>
                </div>
              ) : (
                <div key={i} className="h-9 rounded-lg animate-pulse" style={{ background: 'rgba(201,168,76,0.04)' }} />
              )
            )}
          </div>
        </div>

        {/* COO Panel */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: '#0f2035', borderColor: 'rgba(201,168,76,0.15)' }}
        >
          <PanelHeader
            title="COO"
            badge={cooData ? `${cooData.tasks.filter((t) => t.status === 'in_progress').length} active` : undefined}
            onViewAll={() => router.push('/dashboard/operations')}
          />
          <div className="p-4 flex flex-col gap-2">
            <p className="text-[10px] font-mono uppercase tracking-widest px-1 mb-1" style={{ color: 'rgba(122,149,176,0.5)' }}>
              Operational Tasks
            </p>
            {(cooData?.tasks ?? Array(5).fill(null)).map((task, i) =>
              task ? (
                <div
                  key={task.id}
                  className="px-3 py-2.5 rounded-lg"
                  style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs leading-snug flex-1" style={{ color: '#c0cdd8' }}>
                      {task.title}
                    </p>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                      style={{
                        background: `${STATUS_STYLES[task.status]?.color}18`,
                        color: STATUS_STYLES[task.status]?.color,
                      }}
                    >
                      {STATUS_STYLES[task.status]?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono" style={{ color: '#7a95b0' }}>
                      {task.id}
                    </span>
                    <span
                      className="h-2.5 w-px"
                      style={{ background: 'rgba(201,168,76,0.15)' }}
                    />
                    <span className="text-[10px] font-mono" style={{ color: '#7a95b0' }}>
                      {task.team}
                    </span>
                    <span
                      className="h-2.5 w-px"
                      style={{ background: 'rgba(201,168,76,0.15)' }}
                    />
                    <span
                      className="text-[10px] font-mono font-semibold"
                      style={{ color: PRIORITY_STYLES[task.priority] }}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div key={i} className="h-14 rounded-lg animate-pulse" style={{ background: 'rgba(201,168,76,0.04)' }} />
              )
            )}
          </div>
        </div>

        {/* CFO Panel */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: '#0f2035', borderColor: 'rgba(201,168,76,0.15)' }}
        >
          <PanelHeader title="CFO" badge="Cash Flow" onViewAll={() => router.push('/dashboard/financials')} />
          <div className="p-4">
            {/* Balance overview */}
            <div
              className="rounded-lg px-4 py-4 mb-4"
              style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.15)' }}
            >
              <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: '#7a95b0' }}>
                Net Balance
              </p>
              <p className="text-2xl font-semibold mb-3" style={{ color: '#c9a84c' }}>
                {cfoData ? formatCurrency(cfoData.balance) : '—'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-mono" style={{ color: '#7a95b0' }}>
                    Inflow
                  </p>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight size={11} style={{ color: '#4a9c5d' }} />
                    <p className="text-sm font-semibold" style={{ color: '#4a9c5d' }}>
                      {cfoData ? formatCurrency(cfoData.inflow) : '—'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-mono" style={{ color: '#7a95b0' }}>
                    Outflow
                  </p>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight
                      size={11}
                      style={{ color: '#e05252', transform: 'rotate(90deg)' }}
                    />
                    <p className="text-sm font-semibold" style={{ color: '#e05252' }}>
                      {cfoData ? formatCurrency(cfoData.outflow) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent transactions */}
            <p className="text-[10px] font-mono uppercase tracking-widest px-1 mb-2" style={{ color: 'rgba(122,149,176,0.5)' }}>
              Recent Transactions
            </p>
            <div className="flex flex-col gap-1.5">
              {(cfoData?.transactions ?? Array(4).fill(null)).map((tx, i) =>
                tx ? (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {tx.type === 'credit' ? (
                        <CheckCircle2 size={12} style={{ color: '#4a9c5d', flexShrink: 0 }} />
                      ) : (
                        <AlertCircle size={12} style={{ color: '#c9a84c', flexShrink: 0 }} />
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] truncate" style={{ color: '#c0cdd8' }}>
                          {tx.label}
                        </p>
                        <p className="text-[10px] font-mono" style={{ color: '#7a95b0' }}>
                          {tx.date}
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-xs font-semibold font-mono flex-shrink-0 ml-2"
                      style={{ color: tx.type === 'credit' ? '#4a9c5d' : '#f0f4f8' }}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                ) : (
                  <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: 'rgba(201,168,76,0.04)' }} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
