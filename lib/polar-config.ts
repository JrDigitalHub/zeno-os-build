/**
 * lib/polar-config.ts — Polar checkout URL configuration for Zeno OS.
 *
 * INSTRUCTIONS FOR ACTIVATION:
 *  1. Create your products in Polar (https://polar.sh).
 *  2. Copy each product's checkout link ID from the Polar dashboard.
 *  3. Replace the POLAR_CHECKOUT_IDS values below.
 *  4. The workspace_id query parameter is appended automatically so
 *     your backend webhooks can identify the subscribing workspace.
 *
 * Format:  https://buy.polar.sh/<CHECKOUT_ID>?workspace_id=<workspaceId>
 */

// ── Checkout link IDs (paste yours here) ────────────────────────────────────

export const POLAR_CHECKOUT_IDS = {
  /** Starter plan — $19/mo */
  starter: 'https://buy.polar.sh/polar_cl_wUUh2kO7oSvc5GUDXph6B8Wj8W2Ycn1USaP06311BZu',
  /** Professional plan — $99/mo */
  professional: 'https://buy.polar.sh/polar_cl_I2BEfh73UM6k2EBhE5h0JFU0kyGsPki5vzW4628ecCo',
} as const

export type PolarPlanKey = keyof typeof POLAR_CHECKOUT_IDS

// ── URL builder ──────────────────────────────────────────────────────────────

const POLAR_BASE = 'https://buy.polar.sh'

/**
 * Returns the full Polar checkout URL for a given plan, with the
 * workspace_id query parameter appended for webhook identification.
 *
 * @example
 * buildPolarUrl('starter', 'acme_workspace_42')
 * // → "https://buy.polar.sh/POLAR_STARTER_CHECKOUT_ID?workspace_id=acme_workspace_42"
 */
export function buildPolarUrl(plan: PolarPlanKey, workspaceId: string): string {
  const url = POLAR_CHECKOUT_IDS[plan]
  const params = new URLSearchParams({ workspace_id: workspaceId })
  return `${url}?${params.toString()}`
}
