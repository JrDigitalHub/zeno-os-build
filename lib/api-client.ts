/**
 * lib/api-client.ts — Centralized API client for Zeno OS.
 *
 * Features:
 *  - Base URL read from NEXT_PUBLIC_API_BASE_URL env variable
 *  - Auto-injects Content-Type + Authorization headers
 *  - 429 interceptor: triggers global tokenLimitHit flag via AppContext singleton
 *  - Typed error objects for consistent downstream handling
 *  - Fully typed generic helpers: get / post / put / patch / del
 *
 * Usage:
 *   import { apiClient } from '@/lib/api-client'
 *   const data = await apiClient.get<MyType>('/leads')
 *   await apiClient.post('/tasks', { title: 'New task' })
 */

import { triggerTokenLimitHit } from '@/context/AppContext'

// ── Configuration ──────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? ''

// ── Error type ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    /** Raw parsed response body, if available */
    public readonly data: unknown = null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ── Auth token helper ──────────────────────────────────────────────────────
// Reads from localStorage. Swap `localStorage.getItem('zeno_auth_token')`
// for your auth provider's session token retrieval in backend integration.

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('zeno_auth_token')
}

// ── Core request function ──────────────────────────────────────────────────

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  customHeaders?: Record<string, string>,
): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  const token = getAuthToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client': 'zeno-os/2.4.1',
    ...customHeaders,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response: Response

  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (networkError) {
    // Network-level failure (offline, DNS, CORS preflight blocked)
    throw new ApiError(0, 'Network error — please check your connection.', networkError)
  }

  // ── 429 interceptor ──────────────────────────────────────────────────────
  // Fires the global tokenLimitHit flag so COO/CFO pages automatically
  // drop their blur overlay and prompt the user to upgrade.
  if (response.status === 429) {
    triggerTokenLimitHit(true)
    throw new ApiError(
      429,
      'Token limit reached — please upgrade your plan to continue.',
      null,
    )
  }

  // ── 401 / 403 ────────────────────────────────────────────────────────────
  if (response.status === 401 || response.status === 403) {
    throw new ApiError(
      response.status,
      response.status === 401
        ? 'Session expired — please sign in again.'
        : 'You do not have permission to perform this action.',
      null,
    )
  }

  // ── 204 No Content ───────────────────────────────────────────────────────
  if (response.status === 204) {
    return undefined as T
  }

  // ── Parse response body ──────────────────────────────────────────────────
  let data: unknown
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  // ── Non-2xx errors ───────────────────────────────────────────────────────
  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: unknown }).message)
        : response.statusText || `HTTP ${response.status}`
    throw new ApiError(response.status, message, data)
  }

  return data as T
}

// ── Public API surface ─────────────────────────────────────────────────────

export const apiClient = {
  /** GET request — returns parsed JSON typed as T */
  get<T = unknown>(path: string, headers?: Record<string, string>): Promise<T> {
    return request<T>('GET', path, undefined, headers)
  },

  /** POST request — sends body as JSON, returns parsed JSON typed as T */
  post<T = unknown>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return request<T>('POST', path, body, headers)
  },

  /** PUT request */
  put<T = unknown>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return request<T>('PUT', path, body, headers)
  },

  /** PATCH request */
  patch<T = unknown>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return request<T>('PATCH', path, body, headers)
  },

  /** DELETE request */
  del<T = unknown>(path: string, headers?: Record<string, string>): Promise<T> {
    return request<T>('DELETE', path, undefined, headers)
  },
} as const
