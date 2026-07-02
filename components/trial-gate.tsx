'use client'

import { Lock, Zap, AlertTriangle, FlaskConical } from 'lucide-react'

export const TRIAL_LIMIT = 3 // allowed free actions before gate fires

// ── Trial credit banner ────────────────────────────────────────────────────
// Shown while Trial usage < TRIAL_LIMIT. Includes a purple dev-only button to
// simulate usage without performing a real action.

export function TrialCreditBanner({
  used,
  total = TRIAL_LIMIT,
  agentName,
  actionLabel = 'Tasks',
  onDevIncrease,
  onUpgrade,
}: {
  used: number
  total?: number
  agentName: string
  /** Short noun for what the counter tracks, e.g. "COO Tasks" or "CFO Uploads" */
  actionLabel?: string
  onDevIncrease?: () => void
  /** Called when the user clicks any Upgrade CTA inside this banner */
  onUpgrade?: () => void
}) {
  const remaining = total - used
  const pct = Math.min((used / total) * 100, 100)
  const isLow = remaining === 1

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl mb-5 flex-wrap"
      style={{
        background: isLow ? 'rgba(224,160,82,0.07)' : 'rgba(201,168,76,0.05)',
        border: `1px solid ${isLow ? 'rgba(224,160,82,0.35)' : 'rgba(201,168,76,0.18)'}`,
      }}
    >
      <div className="flex items-center gap-3">
        <Zap
          size={14}
          style={{ color: isLow ? '#e0a052' : '#c9a84c', flexShrink: 0 }}
        />
        <div>
          <p className="text-xs font-semibold" style={{ color: '#f0f4f8' }}>
            Trial Mode · {agentName} Agent
          </p>
          <p
            className="text-[11px] font-mono"
            style={{ color: isLow ? '#e0a052' : '#7a95b0' }}
          >
            {remaining}/{total} Free {actionLabel} Remaining
            {isLow ? ' — Last action!' : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Progress bar */}
        <div className="flex items-center gap-2" style={{ minWidth: 110 }}>
          <div
            className="flex-1 rounded-full overflow-hidden"
            style={{ height: 5, background: 'rgba(122,149,176,0.15)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: isLow
                  ? 'linear-gradient(90deg, #e0a052, #e05252)'
                  : 'linear-gradient(90deg, #c9a84c, #a88030)',
              }}
            />
          </div>
          <span
            className="text-[10px] font-mono font-semibold"
            style={{ color: isLow ? '#e0a052' : '#c9a84c' }}
          >
            {remaining}/{total}
          </span>
        </div>

        {/* Upgrade CTA — always routes */}
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all"
            style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.35)',
              color: '#c9a84c',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                'rgba(201,168,76,0.22)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                'rgba(201,168,76,0.12)')
            }
          >
            <Zap size={10} />
            Upgrade
          </button>
        )}

        {/* DEV-only: manually simulate usage */}
        {process.env.NODE_ENV !== 'production' && onDevIncrease && (
          <button
            onClick={onDevIncrease}
            disabled={used >= total}
            title="[DEV] Simulate 1 action use"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#a78bfa',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                'rgba(139,92,246,0.22)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                'rgba(139,92,246,0.12)')
            }
          >
            <FlaskConical size={10} />
            +1 Use
          </button>
        )}
      </div>
    </div>
  )
}

// ── Trial lock overlay ─────────────────────────────────────────────────────
// Full-screen blur overlay shown when the trial gate fires.
// The Upgrade button always calls onUpgrade (routes to billing).

export function TrialLockOverlay({
  agentName,
  actionLabel = 'actions',
  onUpgrade,
}: {
  agentName: string
  /** Short noun for what was exhausted, e.g. "COO tasks" or "CFO uploads" */
  actionLabel?: string
  /** Called when user clicks the Upgrade button — should navigate to /dashboard/billing */
  onUpgrade?: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 rounded-xl"
      style={{
        background: 'rgba(11,25,41,0.82)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(201,168,76,0.1)',
          border: '2px solid rgba(201,168,76,0.35)',
          boxShadow: '0 0 30px rgba(201,168,76,0.12)',
        }}
      >
        <Lock size={24} style={{ color: '#c9a84c' }} />
      </div>

      <div className="text-center px-8 max-w-xs">
        <p className="text-sm font-bold mb-1.5" style={{ color: '#f0f4f8' }}>
          Free trial limit reached
        </p>
        <p className="text-xs font-mono leading-relaxed" style={{ color: '#7a95b0' }}>
          You've used all {TRIAL_LIMIT} free {actionLabel}. Upgrade to keep
          the {agentName} Agent working for your business.
        </p>
      </div>

      <button
        onClick={onUpgrade}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all"
        style={{
          background: '#c9a84c',
          color: '#0b1929',
          boxShadow: '0 4px 24px rgba(201,168,76,0.35)',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = '#d4b560')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = '#c9a84c')
        }
      >
        <Zap size={14} />
        Upgrade to unlock the {agentName} Agent
      </button>
    </div>
  )
}

// ── Starter credit banner ──────────────────────────────────────────────────
// Shown for Starter tier — not a hard lock, just a usage quota indicator.

export function StarterCreditBanner({
  used,
  total,
  agentName,
}: {
  used: number
  total: number
  agentName: string
}) {
  const pct = Math.min((used / total) * 100, 100)
  const isWarning = pct >= 60

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl mb-5 flex-wrap"
      style={{
        background: isWarning ? 'rgba(224,160,82,0.07)' : 'rgba(122,149,176,0.07)',
        border: `1px solid ${
          isWarning ? 'rgba(224,160,82,0.3)' : 'rgba(122,149,176,0.2)'
        }`,
      }}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle
          size={15}
          style={{ color: isWarning ? '#e0a052' : '#7a95b0', flexShrink: 0 }}
        />
        <div>
          <p className="text-xs font-semibold" style={{ color: '#f0f4f8' }}>
            Starter Plan · {agentName}
          </p>
          <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
            {used}/{total} Daily Tasks Remaining —{' '}
            {(100 - pct).toFixed(0)}% of quota used
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-2 flex-shrink-0"
        style={{ minWidth: 120 }}
      >
        <div
          className="flex-1 rounded-full overflow-hidden"
          style={{ height: 5, background: 'rgba(122,149,176,0.15)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: isWarning
                ? 'linear-gradient(90deg, #e0a052, #e05252)'
                : 'linear-gradient(90deg, #c9a84c, #a88030)',
            }}
          />
        </div>
        <span
          className="text-[10px] font-mono"
          style={{ color: isWarning ? '#e0a052' : '#7a95b0' }}
        >
          {used}/{total}
        </span>
      </div>
    </div>
  )
}
