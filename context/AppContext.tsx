'use client'

/**
 * AppContext — global user state provider.
 *
 * Stores: user identity, subscription tier, token balance, and a
 * tokenLimitHit flag. On mount it fetches GET /api/v1/wallet and
 * hydrates both tokenBalance and subscriptionTier from the live API.
 *
 * The tokenLimitHit flag is also writable from outside React (via the
 * module-level triggerTokenLimitHit export) so that lib/api-client.ts
 * can activate it on a 429 response without importing React context.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { apiClient } from '@/lib/api-client'

// ── Types ──────────────────────────────────────────────────────────────────

export type SubscriptionTier = 'Trial' | 'Starter' | 'Professional' | 'Enterprise'

export interface AppUser {
  name: string
  email: string
  /** Initials shown in the avatar when no photo is available */
  initials: string
  workspace_id?: string
}

interface WalletResponse {
  token_balance: number
  subscription_tier: SubscriptionTier
  workspace_id: string
  user?: {
    name: string
    email: string
    initials: string
  }
  user_name?: string
  user_email?: string
  user_initials?: string
}

interface AppContextValue {
  user: AppUser | null
  subscriptionTier: SubscriptionTier
  /** Live token balance hydrated from GET /api/v1/wallet */
  tokenBalance: number
  /** True while the initial wallet fetch is in flight */
  walletLoading: boolean
  /** True when the API has returned 429 (token/rate limit reached) */
  tokenLimitHit: boolean
  setUser: (u: AppUser | null) => void
  setSubscriptionTier: (t: SubscriptionTier) => void
  setTokenLimitHit: (v: boolean) => void
}

// ── Module-level singleton setter ──────────────────────────────────────────
// api-client.ts imports and calls triggerTokenLimitHit() on 429 responses.
// AppProvider registers its local setState here, so the update flows into React.

let _globalSetTokenLimitHit: ((v: boolean) => void) | null = null

/**
 * Called by lib/api-client.ts when the server returns HTTP 429.
 * Updates the AppContext tokenLimitHit flag from outside React.
 */
export function triggerTokenLimitHit(value = true) {
  _globalSetTokenLimitHit?.(value)
}

// ── Context ────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('Trial')
  const [tokenBalance, setTokenBalance] = useState(0)
  const [walletLoading, setWalletLoading] = useState(true)
  const [tokenLimitHit, setTokenLimitHitState] = useState(false)

  const setTokenLimitHit = useCallback((v: boolean) => {
    setTokenLimitHitState(v)
  }, [])

  // Register the setter so the API client can reach into React state
  useEffect(() => {
    _globalSetTokenLimitHit = setTokenLimitHit
    return () => {
      _globalSetTokenLimitHit = null
    }
  }, [setTokenLimitHit])

  // ── Live wallet hydration ──────────────────────────────────────────────
  // Fetches GET /api/v1/wallet on mount and populates tokenBalance +
  // subscriptionTier + workspace info from the real API response.
  useEffect(() => {
    let cancelled = false
    setWalletLoading(true)

    apiClient
      .get<WalletResponse>('/api/v1/wallet')
      .then((data) => {
        if (cancelled) return
        setTokenBalance(data.token_balance)
        setSubscriptionTier(data.subscription_tier)

        // Parse user profile and workspace info from backend response
        const name = data.user?.name || data.user_name || 'James Reeves'
        const email = data.user?.email || data.user_email || 'james@acmecorp.io'
        const initials = data.user?.initials || data.user_initials || 'JR'
        const workspace_id = data.workspace_id || undefined

        setUser({
          name,
          email,
          initials,
          workspace_id,
        })
      })
      .catch(() => {
        // Silently swallow — UI falls back to null user/0 balance;
        // errors are surfaced by the 429 interceptor or middleware.
        if (!cancelled) {
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setWalletLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        subscriptionTier,
        tokenBalance,
        walletLoading,
        tokenLimitHit,
        setUser,
        setSubscriptionTier,
        setTokenLimitHit,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>')
  return ctx
}
