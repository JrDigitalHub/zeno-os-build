'use client'

/**
 * Lightweight toast system — no external dependencies beyond React.
 * Exported API matches the shadcn/ui useToast surface exactly so
 * it can be swapped for the official package at any time.
 */

import * as React from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

export type ToastVariant = 'default' | 'success' | 'warning' | 'error'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type ToastAction =
  | { type: 'ADD'; toast: Toast }
  | { type: 'REMOVE'; id: string }

// ── Singleton store ────────────────────────────────────────────────────────

type Listener = (toasts: Toast[]) => void

let _toasts: Toast[] = []
const _listeners = new Set<Listener>()

function dispatch(action: ToastAction) {
  if (action.type === 'ADD') {
    _toasts = [..._toasts, action.toast]
  } else {
    _toasts = _toasts.filter((t) => t.id !== action.id)
  }
  _listeners.forEach((l) => l([..._toasts]))
}

// ── Public API ─────────────────────────────────────────────────────────────

export function toast(options: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).slice(2)
  const duration = options.duration ?? 4000
  dispatch({ type: 'ADD', toast: { ...options, id } })
  setTimeout(() => dispatch({ type: 'REMOVE', id }), duration)
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([..._toasts])

  React.useEffect(() => {
    _listeners.add(setToasts)
    return () => { _listeners.delete(setToasts) }
  }, [])

  return { toasts, toast }
}
