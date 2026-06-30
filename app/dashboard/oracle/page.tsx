'use client'

import { useState } from 'react'
import { Search, X, Mail, Globe, Building2, User, ChevronRight, Loader2 } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type Lead = {
  id: number
  company: string
  contact: string
  role: string
  domain: string
  status: 'Verified' | 'Unverified' | 'Enriched'
  score: number
}

type DraftModalState = {
  open: boolean
  lead: Lead | null
}

// ── Seed data generator ────────────────────────────────────────────────────

function generateLeads(query: string): Lead[] {
  const companies = [
    { company: 'Apex Systems', contact: 'Jordan Reeves', role: 'VP of Operations', domain: `${query.toLowerCase().replace(/\s+/g, '')}.io` },
    { company: 'Meridian Capital', contact: 'Priya Nair', role: 'Chief Strategy Officer', domain: `meridian-${query.toLowerCase().replace(/\s+/g, '')}.com` },
    { company: 'Nova Dynamics', contact: 'Samuel Chen', role: 'Head of Growth', domain: `novadynamics.co` },
    { company: 'Lumen Ventures', contact: 'Aisha Okonkwo', role: 'Director of Partnerships', domain: `lumenventures.io` },
    { company: 'Stratos Group', contact: 'Marcus Webb', role: 'CEO', domain: `stratosgroup.com` },
    { company: 'Cypher Labs', contact: 'Elena Vasquez', role: 'CTO', domain: `cypherlabs.dev` },
    { company: 'Helix Industries', contact: 'Daniel Park', role: 'VP Sales', domain: `helixind.com` },
  ]
  return companies.map((c, i) => ({
    id: i + 1,
    ...c,
    status: (['Verified', 'Enriched', 'Unverified', 'Enriched', 'Verified', 'Unverified', 'Enriched'][i] as Lead['status']),
    score: [92, 87, 74, 95, 68, 81, 79][i],
  }))
}

// ── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Lead['status'] }) {
  const map: Record<Lead['status'], { bg: string; color: string }> = {
    Verified:   { bg: 'rgba(74,156,93,0.12)',   color: '#4a9c5d' },
    Enriched:   { bg: 'rgba(201,168,76,0.12)',  color: '#c9a84c' },
    Unverified: { bg: 'rgba(122,149,176,0.12)', color: '#7a95b0' },
  }
  const s = map[status]
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  )
}

// ── Score bar ──────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? '#c9a84c' : score >= 75 ? '#4a9c5d' : '#7a95b0'
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 w-20 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-mono" style={{ color }}>
        {score}
      </span>
    </div>
  )
}

// ── Draft email modal ──────────────────────────────────────────────────────

function DraftModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const subject = `Partnership Opportunity — Zeno OS x ${lead.company}`
  const body = `Hi ${lead.contact.split(' ')[0]},

I came across ${lead.company} (${lead.domain}) and wanted to reach out directly to you as ${lead.role}.

We are building Zeno OS — a Neural Business Operating System that helps companies like yours automate operations, accelerate growth, and gain real-time financial clarity through AI agents.

Given your focus area, I believe there is a strong alignment worth exploring. Would you be open to a 20-minute conversation this week?

Best regards,
Zeno OS Team`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{
          background: '#0f2035',
          border: '1px solid rgba(201,168,76,0.2)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}
        >
          <div className="flex items-center gap-2.5">
            <Mail size={15} style={{ color: '#c9a84c' }} />
            <span className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
              Draft Email — {lead.contact}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors"
            style={{ color: '#7a95b0' }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
              To
            </label>
            <div
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.15)',
                color: '#c0cdd8',
                fontFamily: 'monospace',
              }}
            >
              {lead.contact.toLowerCase().replace(' ', '.')}@{lead.domain}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
              Subject
            </label>
            <div
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.15)',
                color: '#c0cdd8',
              }}
            >
              {subject}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
              Body
            </label>
            <textarea
              defaultValue={body}
              rows={9}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none outline-none transition-colors"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.15)',
                color: '#c0cdd8',
                fontFamily: 'monospace',
                lineHeight: '1.6',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)')}
            />
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              color: '#7a95b0',
              border: '1px solid rgba(122,149,176,0.2)',
            }}
          >
            Discard
          </button>
          <button
            className="px-5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: '#c9a84c',
              color: '#0b1929',
            }}
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function OraclePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [leads, setLeads] = useState<Lead[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [modal, setModal] = useState<DraftModalState>({ open: false, lead: null })

  function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setLeads([])
    setProgress(0)
    setHasSearched(true)

    // Simulate scraping progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(interval)
          return p
        }
        return p + Math.random() * 18
      })
    }, 220)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setLeads(generateLeads(query))
        setLoading(false)
        setProgress(0)
      }, 400)
    }, 2200)
  }

  function openDraft(lead: Lead) {
    setModal({ open: true, lead })
  }

  return (
    <>
      {modal.open && modal.lead && (
        <DraftModal lead={modal.lead} onClose={() => setModal({ open: false, lead: null })} />
      )}

      <div className="p-6 max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Search size={16} style={{ color: '#c9a84c' }} />
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
              Oracle · Research Engine
            </span>
          </div>
          <h1 className="text-xl font-semibold text-balance" style={{ color: '#f0f4f8' }}>
            Lead Intelligence
          </h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
            Enter a target domain or keyword to discover and enrich leads.
          </p>
        </div>

        {/* Search bar */}
        <div
          className="flex gap-3 mb-6 p-4 rounded-xl"
          style={{
            background: '#0f2035',
            border: '1px solid rgba(201,168,76,0.15)',
          }}
        >
          <div className="flex-1 relative">
            <Globe
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: '#7a95b0' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSearch()
              }}
              placeholder="e.g. saas fintech london or techcrunch.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.18)',
                color: '#f0f4f8',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)')}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#c9a84c', color: '#0b1929' }}
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <ChevronRight size={15} />
            )}
            {loading ? 'Researching…' : 'Start Research'}
          </button>
        </div>

        {/* Progress bar */}
        {loading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
                Scanning targets…
              </span>
              <span className="text-[10px] font-mono" style={{ color: '#c9a84c' }}>
                {Math.min(100, Math.round(progress))}%
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, progress)}%`,
                  background: 'linear-gradient(90deg, #9c7d35, #c9a84c)',
                }}
              />
            </div>
          </div>
        )}

        {/* Results table */}
        {leads.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              border: '1px solid rgba(201,168,76,0.15)',
            }}
          >
            {/* Table header */}
            <div
              className="grid gap-4 px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider"
              style={{
                background: '#0f2035',
                color: '#7a95b0',
                gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr auto',
                borderBottom: '1px solid rgba(201,168,76,0.1)',
              }}
            >
              <span className="flex items-center gap-1.5"><Building2 size={10} /> Company</span>
              <span className="flex items-center gap-1.5"><User size={10} /> Contact</span>
              <span>Domain</span>
              <span>Status</span>
              <span>Score</span>
              <span>Action</span>
            </div>

            {/* Table rows */}
            {leads.map((lead, i) => (
              <div
                key={lead.id}
                className="grid gap-4 px-4 py-3.5 items-center transition-colors"
                style={{
                  gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr auto',
                  background: i % 2 === 0 ? '#0d1e30' : 'rgba(15,32,53,0.6)',
                  borderBottom: i < leads.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none',
                }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: '#f0f4f8' }}>
                    {lead.company}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#c0cdd8' }}>
                    {lead.contact}
                  </p>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>
                    {lead.role}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                    {lead.domain}
                  </span>
                </div>
                <div>
                  <StatusBadge status={lead.status} />
                </div>
                <div>
                  <ScoreBar score={lead.score} />
                </div>
                <div>
                  <button
                    onClick={() => openDraft(lead)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                    style={{
                      background: 'rgba(201,168,76,0.1)',
                      color: '#c9a84c',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)'
                    }}
                  >
                    <Mail size={11} />
                    Draft Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {hasSearched && !loading && leads.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-xl"
            style={{ border: '1px dashed rgba(201,168,76,0.15)' }}
          >
            <Search size={32} style={{ color: 'rgba(201,168,76,0.3)' }} />
            <p className="mt-3 text-sm font-mono" style={{ color: '#7a95b0' }}>
              No results found. Try a different query.
            </p>
          </div>
        )}

        {!hasSearched && (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-xl"
            style={{ border: '1px dashed rgba(201,168,76,0.12)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
            >
              <Globe size={20} style={{ color: '#c9a84c' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#c0cdd8' }}>
              Ready to research
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: '#7a95b0' }}>
              Enter a domain or keyword above to begin lead discovery.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
