'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, AlertTriangle, CheckCircle2, Sparkles, X, Clock } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

// ── Types ───────────────────────────────────────────────────────────────────

type Agent = 'CFO' | 'COO' | 'Oracle'
type AlertLevel = 'warning' | 'success' | 'info'

interface FeedAlert {
  id: string
  agent: Agent
  level: AlertLevel
  title: string
  body: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    href: string
  }
}

// ── Static feed data ─────────────────────────────────────────────────────────

const INITIAL_FEED: FeedAlert[] = [
  {
    id: 'cfo-1',
    agent: 'CFO',
    level: 'warning',
    title: 'Cash Flow Dip Detected',
    body: 'Projected 14-day runway shows a £18,400 shortfall based on current burn rate and pending receivables. Immediate review recommended before Friday payroll cycle.',
    timestamp: '2 mins ago',
    read: false,
    action: { label: 'Review Ledger', href: '/dashboard/financials' },
  },
  {
    id: 'coo-1',
    agent: 'COO',
    level: 'success',
    title: 'Task Bottleneck Resolved',
    body: 'A 3-task blockage in the "Q3 Product Launch" pipeline was detected and automatically re-assigned to available team members. Velocity is back on track.',
    timestamp: '47 mins ago',
    read: false,
    action: { label: 'View Kanban', href: '/dashboard/operations' },
  },
  {
    id: 'oracle-1',
    agent: 'Oracle',
    level: 'info',
    title: '15 High-Intent Leads Discovered',
    body: 'Overnight scan across 6 target domains returned 15 decision-maker contacts with intent signals matching your ICP. 9 have verified email addresses ready for outreach.',
    timestamp: '6 hrs ago',
    read: false,
    action: { label: 'View Leads', href: '/dashboard/oracle' },
  },
]

// ── Accent config per agent ─────────────────────────────────────────────────

const AGENT_CONFIG: Record<Agent, { color: string; bg: string; border: string }> = {
  CFO: {
    color: '#e0a052',
    bg: 'rgba(224,160,82,0.08)',
    border: 'rgba(224,160,82,0.25)',
  },
  COO: {
    color: '#3fbfbf',
    bg: 'rgba(63,191,191,0.08)',
    border: 'rgba(63,191,191,0.22)',
  },
  Oracle: {
    color: '#c9a84c',
    bg: 'rgba(201,168,76,0.08)',
    border: 'rgba(201,168,76,0.22)',
  },
}

const LEVEL_ICON: Record<AlertLevel, React.ElementType> = {
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Sparkles,
}

// ── Bell trigger (exported for use in topbar) ───────────────────────────────

export function NeuralFeedTrigger({
  unread,
  onClick,
}: {
  unread: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all"
      style={{
        background: 'rgba(201,168,76,0.05)',
        border: '1px solid rgba(201,168,76,0.15)',
        color: '#7a95b0',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)'
        ;(e.currentTarget as HTMLElement).style.color = '#c9a84c'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.05)'
        ;(e.currentTarget as HTMLElement).style.color = '#7a95b0'
      }}
      aria-label="Open Neural Feed"
    >
      <Bell size={16} />
      {unread > 0 && (
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{ background: '#e05252', color: '#fff' }}
        >
          {unread}
        </span>
      )}
    </button>
  )
}

// ── Main NeuralFeed panel ────────────────────────────────────────────────────

export function NeuralFeed() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [feed, setFeed] = useState<FeedAlert[]>(INITIAL_FEED)

  const unreadCount = feed.filter((a) => !a.read).length

  function markAllRead() {
    setFeed((prev) => prev.map((a) => ({ ...a, read: true })))
  }

  function dismiss(id: string) {
    setFeed((prev) => prev.filter((a) => a.id !== id))
  }

  function handleAction(alert: FeedAlert) {
    setFeed((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a)),
    )
    setOpen(false)
    if (alert.action) router.push(alert.action.href)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <NeuralFeedTrigger unread={unreadCount} onClick={() => setOpen(true)} />

      <SheetContent className="flex flex-col p-0 overflow-hidden">
        {/* Panel header */}
        <div
          className="flex items-start justify-between px-6 pt-6 pb-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(201,168,76,0.12)' }}
        >
          <SheetHeader>
            <SheetTitle style={{ color: '#f0f4f8' }}>Neural Feed</SheetTitle>
            <SheetDescription style={{ color: '#7a95b0' }}>
              Live agent communications &amp; system alerts
            </SheetDescription>
          </SheetHeader>

          <div className="flex items-center gap-2 mt-0.5">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-mono transition-all px-2 py-1 rounded-lg"
                style={{ color: '#7a95b0', border: '1px solid rgba(122,149,176,0.2)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c9a84c')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div
          className="flex items-center gap-2 px-6 py-2.5 flex-shrink-0"
          style={{ background: 'rgba(201,168,76,0.04)', borderBottom: '1px solid rgba(201,168,76,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4a9c5d' }} />
          <span className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
            {unreadCount > 0
              ? `${unreadCount} unread alert${unreadCount !== 1 ? 's' : ''} · Agents active`
              : 'All caught up · Agents active'}
          </span>
        </div>

        {/* Feed list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {feed.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <CheckCircle2 size={28} style={{ color: 'rgba(201,168,76,0.3)' }} />
              <p className="text-sm font-mono text-center" style={{ color: '#7a95b0' }}>
                No active alerts.<br />Your agents are running smoothly.
              </p>
            </div>
          ) : (
            feed.map((alert) => {
              const cfg = AGENT_CONFIG[alert.agent]
              const LevelIcon = LEVEL_ICON[alert.level]
              return (
                <div
                  key={alert.id}
                  className="relative flex flex-col gap-3 p-4 rounded-xl transition-all"
                  style={{
                    background: alert.read ? 'rgba(201,168,76,0.02)' : cfg.bg,
                    border: `1px solid ${alert.read ? 'rgba(201,168,76,0.08)' : cfg.border}`,
                  }}
                >
                  {/* Dismiss */}
                  <button
                    onClick={() => dismiss(alert.id)}
                    className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded transition-all"
                    style={{ color: 'rgba(122,149,176,0.4)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(122,149,176,0.4)')}
                    aria-label="Dismiss alert"
                  >
                    <X size={12} />
                  </button>

                  {/* Agent badge + title */}
                  <div className="flex items-start gap-3 pr-5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.border}` }}
                    >
                      <LevelIcon size={14} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ background: `${cfg.color}18`, color: cfg.color }}
                        >
                          {alert.agent}
                        </span>
                        {!alert.read && (
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: cfg.color }}
                          />
                        )}
                      </div>
                      <p className="text-sm font-semibold leading-snug" style={{ color: '#f0f4f8' }}>
                        {alert.title}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <p
                    className="text-xs font-mono leading-relaxed pl-11"
                    style={{ color: '#a0b4c8' }}
                  >
                    {alert.body}
                  </p>

                  {/* Footer: timestamp + action */}
                  <div className="flex items-center justify-between pl-11">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: '#7a95b0' }} />
                      <span className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                        {alert.timestamp}
                      </span>
                    </div>
                    {alert.action && (
                      <button
                        onClick={() => handleAction(alert)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                        style={{
                          background: `${cfg.color}14`,
                          border: `1px solid ${cfg.border}`,
                          color: cfg.color,
                        }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background = `${cfg.color}28`
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background = `${cfg.color}14`
                        }}
                      >
                        {alert.action.label}
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Panel footer */}
        <div
          className="px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}
        >
          <p className="text-[11px] font-mono text-center" style={{ color: 'rgba(122,149,176,0.5)' }}>
            Powered by Zeno Neural Engine · Real-time agent signals
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
