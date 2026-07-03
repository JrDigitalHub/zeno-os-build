'use client'

/**
 * Toaster — portal-rendered toast stack.
 * Mount once in dashboard/layout.tsx.
 */

import * as React from 'react'
import { useToast, type Toast } from '@/hooks/use-toast'
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'

// ── Variant config ─────────────────────────────────────────────────────────

const VARIANT_MAP = {
  default: {
    icon: CheckCircle2,
    border: 'rgba(201,168,76,0.35)',
    bg: 'rgba(201,168,76,0.07)',
    iconColor: '#c9a84c',
  },
  success: {
    icon: CheckCircle2,
    border: 'rgba(74,156,93,0.4)',
    bg: 'rgba(74,156,93,0.08)',
    iconColor: '#4a9c5d',
  },
  warning: {
    icon: AlertTriangle,
    border: 'rgba(224,160,82,0.4)',
    bg: 'rgba(224,160,82,0.08)',
    iconColor: '#e0a052',
  },
  error: {
    icon: XCircle,
    border: 'rgba(224,82,82,0.4)',
    bg: 'rgba(224,82,82,0.08)',
    iconColor: '#e05252',
  },
}

// ── Single toast item ──────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const v = VARIANT_MAP[toast.variant ?? 'default']
  const Icon = v.icon

  // Entry animation via mount state
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    // RAF to trigger transition after mount
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 12,
        background: '#0f2035',
        border: `1px solid ${v.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        minWidth: 280,
        maxWidth: 380,
        backdropFilter: 'blur(8px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 8,
          bottom: 8,
          width: 3,
          borderRadius: '0 2px 2px 0',
          background: v.border,
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: v.bg,
          flexShrink: 0,
        }}
      >
        <Icon size={14} style={{ color: v.iconColor }} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#f0f4f8',
            lineHeight: 1.4,
            marginBottom: toast.description ? 2 : 0,
          }}
        >
          {toast.title}
        </p>
        {toast.description && (
          <p style={{ fontSize: 11, color: '#7a95b0', lineHeight: 1.5, fontFamily: 'monospace' }}>
            {toast.description}
          </p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7a95b0',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0f4f8')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
      >
        <X size={12} />
      </button>
    </div>
  )
}

// ── Toaster portal ─────────────────────────────────────────────────────────

export function Toaster() {
  const { toasts, toast: _t } = useToast()
  const [, dismiss] = React.useReducer(
    (prev: Set<string>, id: string) => new Set([...prev, id]),
    new Set<string>()
  )

  // We manage dismissals through the store's built-in timeout
  // but expose a manual dismiss for the X button
  const { toasts: liveToasts } = useToast()

  // Import imperative dismiss from store
  const { dismissToast } = React.useMemo(() => {
    // reach into the module-level _toasts directly via useToast's returned setter
    function dismissToast(id: string) {
      // Re-use the module-scope dispatch by importing toast with duration=0
      // Simplest: just reload without this id by directly updating via toast()
      // We can't directly dispatch REMOVE from here without exporting dispatch,
      // so we track dismissed IDs locally and filter the render.
      dismiss(id)
    }
    return { dismissToast }
  }, [dismiss])

  const [dismissed, dispatchDismiss] = React.useReducer(
    (prev: Set<string>, id: string) => new Set([...prev, id]),
    new Set<string>()
  )

  const visible = liveToasts.filter((t) => !dismissed.has(t.id))

  if (visible.length === 0) return null

  return (
    <div
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {visible.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto', position: 'relative' }}>
          <ToastItem toast={t} onDismiss={() => dispatchDismiss(t.id)} />
        </div>
      ))}
    </div>
  )
}
