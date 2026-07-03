'use client'

/**
 * AppContext — global user state provider.
 *
 * Stores: user identity, subscription tier, and a tokenLimitHit flag.
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

// ── Types ──────────────────────────────────────────────────────────────────

export type SubscriptionTier = 'Trial' | 'Starter' | 'Professional' | 'Enterprise'

export interface AppUser {
  name: string
  email: string
  /** Initials shown in the avatar when no photo is available */
  initials: string
}

interface AppContextValue {
  user: AppUser | null
  subscriptionTier: SubscriptionTier
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

// ── Mock seed data (swap for real auth session in backend integration) ─────

const MOCK_USER: AppUser = {
  name: 'James Reeves',
  email: 'james@acmecorp.io',
  initials: 'JR',
}

// ── Context ────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(MOCK_USER)
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('Trial')
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

  return (
    <AppContext.Provider
      value={{
        user,
        subscriptionTier,
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
