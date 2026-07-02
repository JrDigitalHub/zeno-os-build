'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// ── Token cost per operation ───────────────────────────────────────────────

export const TOKEN_COSTS = {
  CHAT_MESSAGE:  150,    // Standard text chat with any agent
  ORACLE_SEARCH: 1_500,  // Lead intelligence search run
  COO_TASK:      2_000,  // COO task execution / kanban update
  CFO_UPLOAD:    3_500,  // CFO multi-modal file/ledger ingestion
} as const

export type TokenOperation = keyof typeof TOKEN_COSTS

export const OPERATION_LABELS: Record<TokenOperation, string> = {
  CHAT_MESSAGE:  'Agent Chat',
  ORACLE_SEARCH: 'Lead Intelligence Search',
  COO_TASK:      'COO Task Execution',
  CFO_UPLOAD:    'CFO File Ingestion',
}

// ── Vault capacity ─────────────────────────────────────────────────────────

export const STARTER_TOKEN_CAPACITY = 50_000

// ── Context types ──────────────────────────────────────────────────────────

interface LastDeduction {
  operation: TokenOperation
  cost: number
  ts: number  // timestamp — used as key to trigger re-animation
}

interface TokenContextValue {
  tokens: number
  capacity: number
  lastDeduction: LastDeduction | null
  consumeTokens: (operation: TokenOperation) => void
}

const TokenContext = createContext<TokenContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export function TokenProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState(STARTER_TOKEN_CAPACITY)
  const [lastDeduction, setLastDeduction] = useState<LastDeduction | null>(null)

  const consumeTokens = useCallback((operation: TokenOperation) => {
    const cost = TOKEN_COSTS[operation]
    setTokens((prev) => Math.max(0, prev - cost))
    setLastDeduction({ operation, cost, ts: Date.now() })
  }, [])

  return (
    <TokenContext.Provider
      value={{ tokens, capacity: STARTER_TOKEN_CAPACITY, lastDeduction, consumeTokens }}
    >
      {children}
    </TokenContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useTokenVault(): TokenContextValue {
  const ctx = useContext(TokenContext)
  if (!ctx) throw new Error('useTokenVault must be used inside <TokenProvider>')
  return ctx
}

// ── Formatting helper ──────────────────────────────────────────────────────

export function fmtTokens(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}
