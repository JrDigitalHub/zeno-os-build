'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
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
  ReceiptText,
  MessageSquare,
} from 'lucide-react'
import DirectAgentTerminal from '@/components/direct-agent-terminal'
import {
  TRIAL_LIMIT,
  TrialCreditBanner,
  TrialLockOverlay,
  StarterCreditBanner,
} from '@/components/trial-gate'
import { useTokenVault } from '@/components/token-context'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/hooks/use-toast'
import { useAppContext } from '@/context/AppContext'
import { apiClient } from '@/lib/api-client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

// ── Types ──────────────────────────────────────────────────────────────────

type TxType = 'incoming' | 'outgoing'
type FilterType = 'all' | 'incoming' | 'outgoing'
type SubscriptionTier = 'Trial' | 'Starter' | 'Professional'

type Transaction = {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: TxType
}


// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(Math.abs(n))
}

// ── Skeleton row (used during loading) ────────────────────────────────────

function SkeletonRow({ idx }: { idx: number }) {
  return (
    <div
      className="grid px-5 py-3.5 items-center gap-4"
      style={{
        gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr',
        background: idx % 2 === 0 ? '#0d1e30' : 'rgba(15,32,53,0.55)',
        borderBottom: '1px solid rgba(201,168,76,0.04)',
      }}
    >
      <Skeleton className="h-2.5 w-16" />
      <Skeleton className="h-2.5 w-28" />
      <Skeleton className="h-2.5 w-40" />
      <Skeleton className="h-4 w-16 rounded-full" />
      <div className="flex justify-end">
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

// ── Summary card ───────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
  isLoading,
}: {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  color: string
  bg: string
  isLoading?: boolean
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: '#0f2035', border: '1px solid rgba(201,168,76,0.13)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      {isLoading ? (
        <>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-2.5 w-40" />
        </>
      ) : (
        <>
          <p className="text-2xl font-semibold font-mono" style={{ color }}>{value}</p>
          <p className="text-xs mt-1" style={{ color: '#7a95b0' }}>{sub}</p>
        </>
      )}
    </div>
  )
}

// ── Filter pill ────────────────────────────────────────────────────────────

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
      return [...prev, ...Array.from(incoming).filter((f) => !existing.has(f.name))]
    })
  }, [])

  const removeFile = (name: string) => setFiles((prev) => prev.filter((f) => f.name !== name))

  async function handleProcess() {
    setState('processing')
    try {
      let payload: any = {}
      if (tab === 'file') {
        payload = { files: files.map((f) => f.name) }
      } else if (tab === 'url') {
        payload = { url: url.trim() }
      } else if (tab === 'text') {
        payload = { text: rawText.trim() }
      }

      await apiClient.post('/api/v1/cfo/ledger', payload)

      setSummary({ files: files.map((f) => f.name), url: url.trim(), text: rawText.trim().length > 0 })
      setState('done')
      onProcessed()
    } catch (err: any) {
      toast({
        variant: 'error',
        title: 'Error processing data',
        description: err instanceof Error ? err.message : 'Failed to ingest financial data.',
      })
      setState('idle')
    }
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
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(201,168,76,0.12)' }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>Financial Data Ingestion</p>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>CFO · Parse &amp; import new financial data</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ color: '#7a95b0' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f0f4f8')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a95b0')}
          >
            <X size={16} />
          </button>
        </div>

        {state === 'done' && summary ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-12">
            <CheckCircle2 size={36} style={{ color: '#4a9c5d' }} />
            <div className="text-center">
              <p className="text-sm font-semibold mb-1" style={{ color: '#f0f4f8' }}>Data parsed successfully</p>
              <p className="text-xs font-mono" style={{ color: '#7a95b0' }}>Ready to add to your ledger</p>
            </div>
            <div className="w-full rounded-xl p-4 flex flex-col gap-2" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
              {summary.files.length > 0 && (
                <div className="flex items-start gap-2">
                  <Upload size={13} style={{ color: '#c9a84c', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#c9a84c' }}>{summary.files.length} file{summary.files.length > 1 ? 's' : ''} detected</p>
                    {summary.files.map((n) => (
                      <p key={n} className="text-[11px] font-mono truncate" style={{ color: '#7a95b0' }}>{n}</p>
                    ))}
                  </div>
                </div>
              )}
              {summary.url && (
                <div className="flex items-start gap-2">
                  <Link2 size={13} style={{ color: '#c9a84c', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#c9a84c' }}>1 URL parsed</p>
                    <p className="text-[11px] font-mono truncate" style={{ color: '#7a95b0' }}>{summary.url}</p>
                  </div>
                </div>
              )}
              {summary.text && (
                <div className="flex items-center gap-2">
                  <FileText size={13} style={{ color: '#c9a84c', flexShrink: 0 }} />
                  <p className="text-xs font-semibold" style={{ color: '#c9a84c' }}>Raw text block received</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c' }}
              >
                Add to Ledger
              </button>
              <button
                onClick={() => { setState('idle'); setSummary(null); setFiles([]); setUrl(''); setRawText('') }}
                className="px-4 py-2.5 rounded-xl text-sm"
                style={{ color: '#7a95b0', border: '1px solid rgba(122,149,176,0.2)' }}
              >
                Ingest More
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0 overflow-auto">
            {/* Tabs */}
            <div className="flex gap-1 p-3 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
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
                  <Icon size={13} />{label}
                </button>
              ))}
            </div>

            <div className="p-5 flex flex-col gap-4">
              {tab === 'file' && (
                <>
                  <div
                    className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-all"
                    style={{ borderColor: dragOver ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.2)', background: dragOver ? 'rgba(201,168,76,0.05)' : 'transparent' }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={22} style={{ color: dragOver ? '#c9a84c' : '#7a95b0' }} />
                    <div className="text-center">
                      <p className="text-sm font-medium" style={{ color: '#c0cdd8' }}>Drag &amp; drop files here</p>
                      <p className="text-xs font-mono mt-1" style={{ color: '#7a95b0' }}>PDF, CSV, Excel, PNG, JPG · Click to browse</p>
                    </div>
                    <input ref={fileInputRef} type="file" multiple accept={ACCEPTED} className="hidden" onChange={(e) => addFiles(e.target.files)} />
                  </div>
                  {files.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {files.map((f) => (
                        <div key={f.name} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}>
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={12} style={{ color: '#c9a84c', flexShrink: 0 }} />
                            <span className="text-xs font-mono truncate" style={{ color: '#c0cdd8' }}>{f.name}</span>
                            <span className="text-[10px] font-mono flex-shrink-0" style={{ color: '#7a95b0' }}>{(f.size / 1024).toFixed(1)} KB</span>
                          </div>
                          <button onClick={() => removeFile(f.name)}><X size={13} style={{ color: '#7a95b0' }} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {tab === 'url' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>Report or Spreadsheet URL</label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none"
                    style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', color: '#f0f4f8' }}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)')}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)')}
                  />
                </div>
              )}

              {tab === 'text' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>Paste Raw Ledger Data</label>
                  <textarea
                    rows={8}
                    placeholder={'Date, Description, Amount\n2026-06-30, Acme Corp invoice, 4200\n...'}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-xs font-mono outline-none resize-none"
                    style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', color: '#f0f4f8', lineHeight: 1.6 }}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)')}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)')}
                  />
                </div>
              )}

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
                {state === 'processing' ? (<><Loader2 size={15} className="animate-spin" />Parsing financial data...</>) : 'Process Data'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── CFO Ledger Empty State ─────────────────────────────────────────────────

function LedgerEmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
      style={{ background: '#0d1e30', borderTop: '1px solid rgba(201,168,76,0.06)' }}
    >
      {/* Faint receipt icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: 'rgba(201,168,76,0.05)',
          border: '1.5px dashed rgba(201,168,76,0.2)',
        }}
      >
        <ReceiptText size={36} style={{ color: 'rgba(201,168,76,0.25)' }} />
      </div>

      {/* Heading */}
      <h3 className="text-base font-semibold mb-1.5" style={{ color: '#c0cdd8' }}>
        No Financial Data Yet
      </h3>
      <p className="text-xs font-mono max-w-xs leading-relaxed mb-6" style={{ color: '#7a95b0' }}>
        Import your first ledger to start tracking cash flow, identifying anomalies, and building financial clarity.
      </p>

      {/* CTA */}
      <button
        onClick={onUpload}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: 'rgba(201,168,76,0.12)',
          border: '1px solid rgba(201,168,76,0.35)',
          color: '#c9a84c',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)')}
      >
        <Upload size={14} />
        Upload your first statement
      </button>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function FinancialsPage() {
  const router = useRouter()
  const { consumeTokens } = useTokenVault()
  const { subscriptionTier, tokenLimitHit } = useAppContext()

  const [filter, setFilter] = useState<FilterType>('all')
  const [ingestionOpen, setIngestionOpen] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // ── Real data loading from Go backend ──────────────────────────────────
  const [isLoading, setIsLoading] = useState(true)

  const fetchLedger = useCallback((showLoading = false) => {
    if (showLoading) setIsLoading(true)
    apiClient
      .get<any>('/api/v1/cfo/ledger')
      .then((data) => {
        const rawTxns = Array.isArray(data) ? data : data?.transactions ?? []
        const mapped: Transaction[] = rawTxns.map((t: any, index: number) => {
          const type: TxType = t.type === 'credit' || t.type === 'incoming' || t.amount > 0 ? 'incoming' : 'outgoing'
          return {
            id: t.id || `TXN-${String(index + 1).padStart(4, '0')}`,
            date: t.date || t.createdAt || 'Jun 30, 2026',
            description: t.description || t.label || 'Transaction',
            category: t.category || 'General',
            amount: typeof t.amount === 'number' ? t.amount : parseFloat(t.amount) || 0,
            type,
          }
        })
        setTransactions(mapped)
      })
      .catch((err) => {
        toast({
          variant: 'error',
          title: 'Failed to load ledger',
          description: err instanceof Error ? err.message : 'Error fetching from backend.',
        })
      })
      .finally(() => {
        if (showLoading) setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchLedger(true)
  }, [fetchLedger])

  // ── Independent CFO upload counter ─────────────────────────────────────
  const [cfoUploadCount, setCfoUploadCount] = useState(0)
  const isTrialLocked =
    (subscriptionTier === 'Trial' && cfoUploadCount >= TRIAL_LIMIT) || tokenLimitHit

  function recordCfoUpload() {
    if (subscriptionTier === 'Trial') {
      if (cfoUploadCount >= TRIAL_LIMIT) {
        toast({
          variant: 'warning',
          title: 'Token limit reached.',
          description: 'Please upgrade to continue.',
        })
        return
      }
      setCfoUploadCount((c) => Math.min(c + 1, TRIAL_LIMIT))
    }
    consumeTokens('CFO_UPLOAD')
  }

  function goToBilling() { router.push('/dashboard/billing') }

  function handleNewData() {
    if (isTrialLocked) return
    setIngestionOpen(true)
  }

  const visible = useMemo(
    () => filter === 'all' ? transactions : transactions.filter((t) => t.type === filter),
    [filter, transactions]
  )

  const totalBalance  = useMemo(() => visible.reduce((s, t) => s + t.amount, 0), [visible])
  const totalIncoming = useMemo(() => visible.filter((t) => t.type === 'incoming').reduce((s, t) => s + t.amount, 0), [visible])
  const totalOutgoing = useMemo(() => visible.filter((t) => t.type === 'outgoing').reduce((s, t) => s + Math.abs(t.amount), 0), [visible])

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-57px)]">
      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="p-4 sm:p-6 max-w-full">

          {/* Banners */}
          {subscriptionTier === 'Trial' && cfoUploadCount < TRIAL_LIMIT && (
            <TrialCreditBanner
              used={cfoUploadCount}
              agentName="CFO"
              actionLabel="CFO Uploads"
              onDevIncrease={recordCfoUpload}
              onUpgrade={goToBilling}
            />
          )}
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
              <h1 className="text-xl font-semibold" style={{ color: '#f0f4f8' }}>
                Cash Flow &amp; Transactions
              </h1>
              <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
                {isLoading ? '—' : `Showing ${visible.length} of ${transactions.length} transactions`}
              </p>
            </div>
            <button
              onClick={handleNewData}
              disabled={isTrialLocked || isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c' }}
              onMouseEnter={(e) => { if (!isTrialLocked && !isLoading) (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)' }}
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
                fetchLedger(false)
                // ── Success toast ──
                toast({
                  variant: 'success',
                  title: 'File parsed successfully',
                  description: 'Your financial data has been added to the ledger.',
                })
              }}
            />
          )}

          {/* Lock overlay + blurred content */}
          <div className="relative">
            {isTrialLocked && (
              <TrialLockOverlay
                agentName="CFO"
                actionLabel="CFO uploads"
                onUpgrade={goToBilling}
              />
            )}

            <div style={isTrialLocked ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <SummaryCard
                  label="Net Balance"
                  value={`${totalBalance >= 0 ? '+' : '-'}${fmt(totalBalance)}`}
                  sub={`Based on ${visible.length} visible transactions`}
                  icon={Wallet}
                  color={totalBalance >= 0 ? '#c9a84c' : '#e05252'}
                  bg={totalBalance >= 0 ? 'rgba(201,168,76,0.1)' : 'rgba(224,82,82,0.1)'}
                  isLoading={isLoading}
                />
                <SummaryCard
                  label="Total Incoming"
                  value={`+${fmt(totalIncoming)}`}
                  sub={`${visible.filter((t) => t.type === 'incoming').length} inbound transactions`}
                  icon={TrendingUp}
                  color="#4a9c5d"
                  bg="rgba(74,156,93,0.1)"
                  isLoading={isLoading}
                />
                <SummaryCard
                  label="Total Outgoing"
                  value={`-${fmt(totalOutgoing)}`}
                  sub={`${visible.filter((t) => t.type === 'outgoing').length} outbound transactions`}
                  icon={TrendingDown}
                  color="#e05252"
                  bg="rgba(224,82,82,0.1)"
                  isLoading={isLoading}
                />
              </div>

              {/* Ledger table */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
                {/* Table controls */}
                <div
                  className="flex items-center justify-between px-5 py-3.5 border-b"
                  style={{ background: '#0f2035', borderColor: 'rgba(201,168,76,0.1)' }}
                >
                  <div className="flex items-center gap-2">
                    <Filter size={13} style={{ color: '#7a95b0' }} />
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>Filter</span>
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

                {/* Rows or skeletons */}
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} idx={i} />)
                ) : visible.length === 0 ? (
                  // ── CFO Empty state ──
                  <LedgerEmptyState onUpload={() => setIngestionOpen(true)} />
                ) : (
                  visible.map((tx, i) => {
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
                        <span className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>{tx.id}</span>
                        <span className="text-xs" style={{ color: '#c0cdd8' }}>{tx.date}</span>
                        <span className="text-xs font-medium pr-4 truncate" style={{ color: '#f0f4f8' }}>{tx.description}</span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full w-fit"
                          style={{ background: 'rgba(122,149,176,0.1)', color: '#7a95b0' }}
                        >
                          {tx.category}
                        </span>
                        <div className="flex items-center justify-end gap-1.5">
                          {isIn ? (
                            <ArrowDownLeft size={12} style={{ color: '#4a9c5d', flexShrink: 0 }} />
                          ) : (
                            <ArrowUpRight size={12} style={{ color: '#e05252', flexShrink: 0 }} />
                          )}
                          <span className="text-sm font-semibold font-mono" style={{ color: isIn ? '#4a9c5d' : '#e05252' }}>
                            {isIn ? '+' : '-'}{fmt(tx.amount)}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}

                {/* Footer totals — only when not loading and has data */}
                {!isLoading && visible.length > 0 && (
                  <div
                    className="grid px-5 py-3.5 items-center border-t"
                    style={{ gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr', background: '#0f2035', borderColor: 'rgba(201,168,76,0.1)' }}
                  >
                    <span /><span />
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#7a95b0' }}>
                      Net Total ({visible.length} records)
                    </span>
                    <span />
                    <span className="text-sm font-semibold font-mono text-right" style={{ color: totalBalance >= 0 ? '#c9a84c' : '#e05252' }}>
                      {totalBalance >= 0 ? '+' : '-'}{fmt(totalBalance)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop terminal (hidden on < lg) ── */}
      <div className="hidden lg:flex w-[30%] flex-shrink-0">
        <DirectAgentTerminal
          agentRole="CFO"
          onCommandSent={() => {
            if (subscriptionTier === 'Trial' && cfoUploadCount < TRIAL_LIMIT) {
              setCfoUploadCount((c) => Math.min(c + 1, TRIAL_LIMIT))
            }
            consumeTokens('CFO_UPLOAD')
          }}
        />
      </div>

      {/* ── Mobile terminal Sheet ── */}
      <Sheet open={terminalOpen} onOpenChange={setTerminalOpen}>
        <SheetContent side="bottom" className="p-0 flex flex-col">
          <SheetHeader className="px-4 pt-4 pb-3 border-b border-[rgba(201,168,76,0.12)]">
            <SheetTitle style={{ color: '#f0f4f8' }}>CFO Agent Terminal</SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0">
            <DirectAgentTerminal
              agentRole="CFO"
              className="border-l-0"
              onCommandSent={() => {
                if (subscriptionTier === 'Trial' && cfoUploadCount < TRIAL_LIMIT) {
                  setCfoUploadCount((c) => Math.min(c + 1, TRIAL_LIMIT))
                }
                consumeTokens('CFO_UPLOAD')
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Mobile floating "Chat with CFO" button ── */}
      <button
        id="cfo-mobile-chat-fab"
        onClick={() => setTerminalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #4a9c5d, #357a47)',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(74,156,93,0.4)',
        }}
        aria-label="Chat with CFO Agent"
      >
        <MessageSquare size={16} />
        Chat with CFO
      </button>
    </div>
  )
}
