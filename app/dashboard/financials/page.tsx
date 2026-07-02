'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  X,
  Upload,
  Link2,
  FileText,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import DirectAgentTerminal from '@/components/direct-agent-terminal'
import {
  TRIAL_LIMIT,
  TrialCreditBanner,
  TrialLockOverlay,
  StarterCreditBanner,
} from '@/components/trial-gate'
import { useTokenVault } from '@/components/token-context'

// ── Types ──────────────────────────────────────────────────────────────────

type TxType = 'incoming' | 'outgoing'
type SubscriptionTier = 'Trial' | 'Starter' | 'Professional'

type Transaction = {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: TxType
}

// ── Mock subscription state (swap to test tiers) ────────────────────────────

const MOCK_TIER: SubscriptionTier = 'Trial'

// ── Seed data ──────────────────────────────────────────────────────────────

const ALL_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-0041', date: 'Jun 30, 2026', description: 'Enterprise license — Apex Systems',    category: 'Revenue',    amount: 12400,  type: 'incoming' },
  { id: 'TXN-0040', date: 'Jun 29, 2026', description: 'Cloud infrastructure (Vercel)',        category: 'Ops',        amount: -2300,  type: 'outgoing' },
  { id: 'TXN-0039', date: 'Jun 28, 2026', description: 'Consulting retainer — Meridian',      category: 'Revenue',    amount: 8750,   type: 'incoming' },
  { id: 'TXN-0038', date: 'Jun 27, 2026', description: 'Payroll disbursement — June',         category: 'Payroll',    amount: -18500, type: 'outgoing' },
  { id: 'TXN-0037', date: 'Jun 26, 2026', description: 'Oracle module subscription × 12',     category: 'Revenue',    amount: 4800,   type: 'incoming' },
  { id: 'TXN-0036', date: 'Jun 25, 2026', description: 'Legal fees — ToS revision',           category: 'Legal',      amount: -3200,  type: 'outgoing' },
  { id: 'TXN-0035', date: 'Jun 24, 2026', description: 'SaaS tooling (Notion, Linear, Figma)', category: 'Software',  amount: -940,   type: 'outgoing' },
  { id: 'TXN-0034', date: 'Jun 23, 2026', description: 'SME partnership revenue — Nova',      category: 'Revenue',    amount: 6200,   type: 'incoming' },
  { id: 'TXN-0033', date: 'Jun 22, 2026', description: 'Marketing & paid acquisition',        category: 'Marketing',  amount: -5100,  type: 'outgoing' },
  { id: 'TXN-0032', date: 'Jun 21, 2026', description: 'Annual insurance premium',            category: 'Insurance',  amount: -1800,  type: 'outgoing' },
  { id: 'TXN-0031', date: 'Jun 20, 2026', description: 'Beta revenue — Helix Industries',     category: 'Revenue',    amount: 3300,   type: 'incoming' },
  { id: 'TXN-0030', date: 'Jun 19, 2026', description: 'R&D contractor — AI pipeline',        category: 'R&D',        amount: -7600,  type: 'outgoing' },
  { id: 'TXN-0029', date: 'Jun 18, 2026', description: 'Lumen Ventures pilot deal',           category: 'Revenue',    amount: 9100,   type: 'incoming' },
  { id: 'TXN-0028', date: 'Jun 17, 2026', description: 'Office & equipment costs',            category: 'Ops',        amount: -1200,  type: 'outgoing' },
  { id: 'TXN-0027', date: 'Jun 16, 2026', description: 'Grant — SME Innovation Fund',         category: 'Grant',      amount: 15000,  type: 'incoming' },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(Math.abs(n))
}

// ── Summary card ───────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
}: {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  color: string
  bg: string
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: '#0f2035',
        border: '1px solid rgba(201,168,76,0.13)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: bg }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-semibold font-mono" style={{ color }}>
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: '#7a95b0' }}>
        {sub}
      </p>
    </div>
  )
}

// ── Filter pill ────────────────────────────────────────────────────────────

type FilterType = 'all' | 'incoming' | 'outgoing'

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
        color: active ? '#c9a84c' : '#7a95b0',
        border: `1px solid ${active ? 'rgba(201,168,76,0.35)' : 'rgba(122,149,176,0.15)'}`,
      }}
    >
      {label}
    </button>
  )
}

// ── Ingestion modal ────────────────────────────────────────────────────────

type IngestionTab = 'file' | 'url' | 'text'
type IngestionState = 'idle' | 'processing' | 'done'

interface IngestionSummary {
  files: string[]
  url: string
  text: boolean
}

function IngestionModal({
  onClose,
  onProcessed,
}: {
  onClose: () => void
  /** Called when data processing completes — allows parent to count the upload */
  onProcessed: () => void
}) {
  const [tab, setTab] = useState<IngestionTab>('file')
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [url, setUrl] = useState('')
  const [rawText, setRawText] = useState('')
  const [state, setState] = useState<IngestionState>('idle')
  const [summary, setSummary] = useState<IngestionSummary | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ACCEPTED = '.pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg'

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name))
      const next = Array.from(incoming).filter((f) => !existing.has(f.name))
      return [...prev, ...next]
    })
  }, [])

  const removeFile = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name))

  async function handleProcess() {
    setState('processing')
    // TODO: replace with real POST to /api/v1/cfo/ingest
    await new Promise((res) => setTimeout(res, 1800))
    setSummary({
      files: files.map((f) => f.name),
      url: url.trim(),
      text: rawText.trim().length > 0,
    })
    setState('done')
    onProcessed() // record the upload against the trial counter + token vault
  }

  const hasInput = files.length > 0 || url.trim() !== '' || rawText.trim() !== ''

  const TABS: { key: IngestionTab; label: string; icon: React.ElementType }[] = [
    { key: 'file', label: 'File / Image', icon: Upload },
    { key: 'url',  label: 'URL',          icon: Link2 },
    { key: 'text', label: 'Raw Text',     icon: FileText },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(11,25,41,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#0f2035',
          border: '1px solid rgba(201,168,76,0.22)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          maxHeight: '90vh',
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(201,168,76,0.12)' }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
              Financial Data Ingestion
            </p>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>
              CFO · Parse &amp; import new financial data
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ color: '#7a95b0' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0f4f8')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
          >
            <X size={16} />
          </button>
        </div>

        {state === 'done' && summary ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-12">
            <CheckCircle2 size={36} style={{ color: '#4a9c5d' }} />
            <div className="text-center">
              <p className="text-sm font-semibold mb-1" style={{ color: '#f0f4f8' }}>
                Data parsed successfully
              </p>
              <p className="text-xs font-mono" style={{ color: '#7a95b0' }}>
                Ready to add to your ledger
              </p>
            </div>
            {/* Summary */}
            <div
              className="w-full rounded-xl p-4 flex flex-col gap-2"
              style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}
            >
              {summary.files.length > 0 && (
                <div className="flex items-start gap-2">
                  <Upload size={13} style={{ color: '#c9a84c', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#c9a84c' }}>
                      {summary.files.length} file{summary.files.length > 1 ? 's' : ''} detected
                    </p>
                    {summary.files.map((n) => (
                      <p key={n} className="text-[11px] font-mono truncate" style={{ color: '#7a95b0' }}>
                        {n}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {summary.url && (
                <div className="flex items-start gap-2">
                  <Link2 size={13} style={{ color: '#c9a84c', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#c9a84c' }}>
                      1 URL parsed
                    </p>
                    <p className="text-[11px] font-mono truncate" style={{ color: '#7a95b0' }}>
                      {summary.url}
                    </p>
                  </div>
                </div>
              )}
              {summary.text && (
                <div className="flex items-center gap-2">
                  <FileText size={13} style={{ color: '#c9a84c', flexShrink: 0 }} />
                  <p className="text-xs font-semibold" style={{ color: '#c9a84c' }}>
                    Raw text block received
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  color: '#c9a84c',
                }}
              >
                Add to Ledger
              </button>
              <button
                onClick={() => { setState('idle'); setSummary(null); setFiles([]); setUrl(''); setRawText('') }}
                className="px-4 py-2.5 rounded-xl text-sm transition-all"
                style={{ color: '#7a95b0', border: '1px solid rgba(122,149,176,0.2)' }}
              >
                Ingest More
              </button>
            </div>
          </div>
        ) : (
          /* ── Input state ── */
          <div className="flex flex-col gap-0 overflow-auto">
            {/* Tabs */}
            <div
              className="flex gap-1 p-3 border-b"
              style={{ borderColor: 'rgba(201,168,76,0.1)' }}
            >
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium flex-1 justify-center transition-all"
                  style={{
                    background: tab === key ? 'rgba(201,168,76,0.12)' : 'transparent',
                    color: tab === key ? '#c9a84c' : '#7a95b0',
                    border: `1px solid ${tab === key ? 'rgba(201,168,76,0.3)' : 'transparent'}`,
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* File tab */}
              {tab === 'file' && (
                <>
                  <div
                    className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-all"
                    style={{
                      borderColor: dragOver ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.2)',
                      background: dragOver ? 'rgba(201,168,76,0.05)' : 'transparent',
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={22} style={{ color: dragOver ? '#c9a84c' : '#7a95b0' }} />
                    <div className="text-center">
                      <p className="text-sm font-medium" style={{ color: '#c0cdd8' }}>
                        Drag &amp; drop files here
                      </p>
                      <p className="text-xs font-mono mt-1" style={{ color: '#7a95b0' }}>
                        PDF, CSV, Excel, PNG, JPG · Click to browse
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ACCEPTED}
                      className="hidden"
                      onChange={(e) => addFiles(e.target.files)}
                    />
                  </div>
                  {files.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {files.map((f) => (
                        <div
                          key={f.name}
                          className="flex items-center justify-between px-3 py-2 rounded-lg"
                          style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={12} style={{ color: '#c9a84c', flexShrink: 0 }} />
                            <span className="text-xs font-mono truncate" style={{ color: '#c0cdd8' }}>
                              {f.name}
                            </span>
                            <span className="text-[10px] font-mono flex-shrink-0" style={{ color: '#7a95b0' }}>
                              {(f.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          <button onClick={() => removeFile(f.name)}>
                            <X size={13} style={{ color: '#7a95b0' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* URL tab */}
              {tab === 'url' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
                    Report or Spreadsheet URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
                    style={{
                      background: 'rgba(201,168,76,0.05)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      color: '#f0f4f8',
                    }}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)')}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)')}
                  />
                  <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                    Supports Google Sheets, Notion exports, SharePoint, and direct CSV/XLSX links.
                  </p>
                </div>
              )}

              {/* Text tab */}
              {tab === 'text' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
                    Paste Raw Ledger Data
                  </label>
                  <textarea
                    rows={8}
                    placeholder={'Date, Description, Amount\n2026-06-30, Acme Corp invoice, 4200\n2026-06-29, AWS infra, -1800\n...'}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-xs font-mono outline-none resize-none transition-all"
                    style={{
                      background: 'rgba(201,168,76,0.05)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      color: '#f0f4f8',
                      lineHeight: 1.6,
                    }}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)')}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)')}
                  />
                  <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                    Paste CSV, tab-separated, or plain text — the parser will normalise the format.
                  </p>
                </div>
              )}

              {/* Process button */}
              <button
                onClick={handleProcess}
                disabled={!hasInput || state === 'processing'}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: hasInput ? 'rgba(201,168,76,0.15)' : 'transparent',
                  border: `1px solid ${hasInput ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)'}`,
                  color: hasInput ? '#c9a84c' : '#7a95b0',
                }}
              >
                {state === 'processing' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Parsing financial data...
                  </>
                ) : (
                  'Process Data'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


// ── Main page ──────────────────────────────────────────────────────────────

export default function FinancialsPage() {
  const router = useRouter()
  const { consumeTokens } = useTokenVault()

  const [filter, setFilter] = useState<FilterType>('all')
  const [ingestionOpen, setIngestionOpen] = useState(false)

  // Mock subscription tier — change MOCK_TIER above to test
  const subscriptionTier: SubscriptionTier = MOCK_TIER

  // ── Independent CFO upload counter ─────────────────────────────────────
  // Counts successful file/ledger uploads on Trial tier.
  // Gate fires when cfoUploadCount reaches TRIAL_LIMIT (i.e. on the 4th attempt).
  const [cfoUploadCount, setCfoUploadCount] = useState(0)

  const isTrialLocked = subscriptionTier === 'Trial' && cfoUploadCount >= TRIAL_LIMIT

  /** Called after ingestion modal completes processing. */
  function recordCfoUpload() {
    if (subscriptionTier === 'Trial') {
      setCfoUploadCount((c) => Math.min(c + 1, TRIAL_LIMIT))
    }
    consumeTokens('CFO_UPLOAD')
  }

  function goToBilling() {
    router.push('/dashboard/billing')
  }

  /** Open ingestion modal or show gate if locked */
  function handleNewData() {
    if (isTrialLocked) {
      // Gate is already visible via the overlay — no-op, overlay handles it
      return
    }
    if (subscriptionTier === 'Trial' && cfoUploadCount >= TRIAL_LIMIT) {
      return
    }
    setIngestionOpen(true)
  }

  const visible = useMemo(
    () =>
      filter === 'all'
        ? ALL_TRANSACTIONS
        : ALL_TRANSACTIONS.filter((t) => t.type === filter),
    [filter]
  )

  const totalBalance = useMemo(
    () => visible.reduce((sum, t) => sum + t.amount, 0),
    [visible]
  )

  const totalIncoming = useMemo(
    () => visible.filter((t) => t.type === 'incoming').reduce((sum, t) => sum + t.amount, 0),
    [visible]
  )

  const totalOutgoing = useMemo(
    () => visible.filter((t) => t.type === 'outgoing').reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [visible]
  )

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* ── 70% main content ── */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="p-6 max-w-full">

          {/* Trial banner — shown while under limit */}
          {subscriptionTier === 'Trial' && cfoUploadCount < TRIAL_LIMIT && (
            <TrialCreditBanner
              used={cfoUploadCount}
              agentName="CFO"
              actionLabel="CFO Uploads"
              onDevIncrease={recordCfoUpload}
              onUpgrade={goToBilling}
            />
          )}

          {/* Starter banner */}
          {subscriptionTier === 'Starter' && (
            <StarterCreditBanner used={15} total={50} agentName="CFO" />
          )}

          {/* Page header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} style={{ color: '#c9a84c' }} />
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
                  CFO · Financial Ledger
                </span>
              </div>
              <h1 className="text-xl font-semibold text-balance" style={{ color: '#f0f4f8' }}>
                Cash Flow &amp; Transactions
              </h1>
              <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
                Showing {visible.length} of {ALL_TRANSACTIONS.length} transactions
              </p>
            </div>
            <button
              onClick={handleNewData}
              disabled={isTrialLocked}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#c9a84c',
              }}
              onMouseEnter={(e) => {
                if (!isTrialLocked) (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)'
              }}
            >
              <Plus size={14} />
              New Data
            </button>
          </div>

          {ingestionOpen && (
            <IngestionModal
              onClose={() => setIngestionOpen(false)}
              onProcessed={() => {
                recordCfoUpload()
                setIngestionOpen(false)
              }}
            />
          )}

          {/* Main content area — blurred only when trial gate fires */}
          <div className="relative">
            {isTrialLocked && (
              <TrialLockOverlay
                agentName="CFO"
                actionLabel="CFO uploads"
                onUpgrade={goToBilling}
              />
            )}

            <div
              style={
                isTrialLocked
                  ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }
                  : {}
              }
            >
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <SummaryCard
                  label="Net Balance"
                  value={`${totalBalance >= 0 ? '+' : '-'}${fmt(totalBalance)}`}
                  sub={`Based on ${visible.length} visible transactions`}
                  icon={Wallet}
                  color={totalBalance >= 0 ? '#c9a84c' : '#e05252'}
                  bg={totalBalance >= 0 ? 'rgba(201,168,76,0.1)' : 'rgba(224,82,82,0.1)'}
                />
                <SummaryCard
                  label="Total Incoming"
                  value={`+${fmt(totalIncoming)}`}
                  sub={`${visible.filter((t) => t.type === 'incoming').length} inbound transactions`}
                  icon={TrendingUp}
                  color="#4a9c5d"
                  bg="rgba(74,156,93,0.1)"
                />
                <SummaryCard
                  label="Total Outgoing"
                  value={`-${fmt(totalOutgoing)}`}
                  sub={`${visible.filter((t) => t.type === 'outgoing').length} outbound transactions`}
                  icon={TrendingDown}
                  color="#e05252"
                  bg="rgba(224,82,82,0.1)"
                />
              </div>

              {/* Ledger table */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(201,168,76,0.15)' }}
              >
                {/* Table controls */}
                <div
                  className="flex items-center justify-between px-5 py-3.5 border-b"
                  style={{
                    background: '#0f2035',
                    borderColor: 'rgba(201,168,76,0.1)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Filter size={13} style={{ color: '#7a95b0' }} />
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
                      Filter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FilterPill label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
                    <FilterPill label="Incoming" active={filter === 'incoming'} onClick={() => setFilter('incoming')} />
                    <FilterPill label="Outgoing" active={filter === 'outgoing'} onClick={() => setFilter('outgoing')} />
                  </div>
                </div>

                {/* Column headers */}
                <div
                  className="grid px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider"
                  style={{
                    background: '#0f2035',
                    color: '#7a95b0',
                    gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
                    borderBottom: '1px solid rgba(201,168,76,0.08)',
                  }}
                >
                  <span>Txn ID</span>
                  <span>Date</span>
                  <span>Description</span>
                  <span>Category</span>
                  <span className="text-right">Amount</span>
                </div>

                {/* Rows */}
                {visible.map((tx, i) => {
                  const isIn = tx.type === 'incoming'
                  return (
                    <div
                      key={tx.id}
                      className="grid px-5 py-3.5 items-center transition-colors"
                      style={{
                        gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
                        background: i % 2 === 0 ? '#0d1e30' : 'rgba(15,32,53,0.55)',
                        borderBottom: i < visible.length - 1 ? '1px solid rgba(201,168,76,0.05)' : 'none',
                      }}
                    >
                      <span className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                        {tx.id}
                      </span>
                      <span className="text-xs" style={{ color: '#c0cdd8' }}>
                        {tx.date}
                      </span>
                      <span className="text-xs font-medium pr-4 truncate" style={{ color: '#f0f4f8' }}>
                        {tx.description}
                      </span>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full w-fit"
                        style={{
                          background: 'rgba(122,149,176,0.1)',
                          color: '#7a95b0',
                        }}
                      >
                        {tx.category}
                      </span>
                      <div className="flex items-center justify-end gap-1.5">
                        {isIn ? (
                          <ArrowDownLeft size={12} style={{ color: '#4a9c5d', flexShrink: 0 }} />
                        ) : (
                          <ArrowUpRight size={12} style={{ color: '#e05252', flexShrink: 0 }} />
                        )}
                        <span
                          className="text-sm font-semibold font-mono"
                          style={{ color: isIn ? '#4a9c5d' : '#e05252' }}
                        >
                          {isIn ? '+' : '-'}{fmt(tx.amount)}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {/* Empty state */}
                {visible.length === 0 && (
                  <div
                    className="flex flex-col items-center justify-center py-16"
                    style={{ background: '#0d1e30' }}
                  >
                    <BookOpen size={28} style={{ color: 'rgba(201,168,76,0.25)' }} />
                    <p className="mt-3 text-xs font-mono" style={{ color: '#7a95b0' }}>
                      No transactions match the current filter.
                    </p>
                  </div>
                )}

                {/* Totals footer */}
                <div
                  className="grid px-5 py-3.5 items-center border-t"
                  style={{
                    gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
                    background: '#0f2035',
                    borderColor: 'rgba(201,168,76,0.1)',
                  }}
                >
                  <span />
                  <span />
                  <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
                    Net Total ({visible.length} records)
                  </span>
                  <span />
                  <span
                    className="text-sm font-semibold font-mono text-right"
                    style={{ color: totalBalance >= 0 ? '#c9a84c' : '#e05252' }}
                  >
                    {totalBalance >= 0 ? '+' : '-'}{fmt(totalBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 30% terminal ── */}
      <div className="w-[30%] flex-shrink-0">
        <DirectAgentTerminal
          agentRole="CFO"
          onCommandSent={() => {
            // Terminal commands on CFO page count as uploads for gating purposes
            if (subscriptionTier === 'Trial' && cfoUploadCount < TRIAL_LIMIT) {
              setCfoUploadCount((c) => Math.min(c + 1, TRIAL_LIMIT))
            }
            consumeTokens('CFO_UPLOAD')
          }}
        />
      </div>
    </div>
  )
}
