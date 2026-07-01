'use client'

import { useState } from 'react'
import {
  Settings,
  Cpu,
  Key,
  Copy,
  Check,
  RefreshCw,
  Search,
  KanbanSquare,
  BookOpen,
} from 'lucide-react'

// ── Shared primitives ──────────────────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0f2035', border: '1px solid rgba(201,168,76,0.14)' }}
    >
      <div
        className="flex items-center gap-2.5 px-6 py-4 border-b"
        style={{ borderColor: 'rgba(201,168,76,0.1)' }}
      >
        <Icon size={15} style={{ color: '#c9a84c' }} />
        <p className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
          {title}
        </p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  readOnly,
  hint,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] font-mono uppercase tracking-wider"
        style={{ color: '#7a95b0' }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm font-mono outline-none transition-all"
        style={{
          background: readOnly ? 'rgba(201,168,76,0.03)' : 'rgba(201,168,76,0.05)',
          border: '1px solid rgba(201,168,76,0.18)',
          color: readOnly ? '#7a95b0' : '#f0f4f8',
          cursor: readOnly ? 'not-allowed' : 'text',
        }}
        onFocus={(e) => {
          if (!readOnly)
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)'
        }}
        onBlur={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.18)')
        }
      />
      {hint && (
        <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

function EngineToggle({
  label,
  description,
  icon: Icon,
  active,
  onChange,
}: {
  label: string
  description: string
  icon: React.ElementType
  active: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 p-4 rounded-xl transition-all"
      style={{
        background: active ? 'rgba(201,168,76,0.06)' : 'rgba(201,168,76,0.02)',
        border: `1px solid ${active ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.08)'}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: active ? 'rgba(201,168,76,0.15)' : 'rgba(122,149,176,0.1)' }}
        >
          <Icon size={15} style={{ color: active ? '#c9a84c' : '#7a95b0' }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: active ? '#f0f4f8' : '#7a95b0' }}>
            {label}
          </p>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span
          className="text-[10px] font-mono uppercase tracking-wider"
          style={{ color: active ? '#4a9c5d' : '#7a95b0' }}
        >
          {active ? 'Active' : 'Paused'}
        </span>
        <button
          role="switch"
          aria-checked={active}
          onClick={() => onChange(!active)}
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            background: active ? 'rgba(201,168,76,0.3)' : 'rgba(122,149,176,0.2)',
            border: `1px solid ${active ? 'rgba(201,168,76,0.6)' : 'rgba(122,149,176,0.3)'}`,
            position: 'relative',
            transition: 'all 200ms',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: active ? 20 : 2,
              width: 16,
              height: 16,
              borderRadius: 8,
              background: active ? '#c9a84c' : '#7a95b0',
              transition: 'left 200ms',
            }}
          />
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  // General
  const [workspaceName, setWorkspaceName] = useState('JR Digital Hub')
  const [industry, setIndustry] = useState('Digital Marketing & Consulting')

  // Engine toggles
  const [oracleActive, setOracleActive] = useState(true)
  const [cooActive, setCooActive] = useState(true)
  const [cfoActive, setCfoActive] = useState(false)

  // API key
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Save
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    // TODO: PATCH /api/v1/workspace/settings
    await new Promise((res) => setTimeout(res, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleGenerateKey() {
    setGenerating(true)
    // TODO: POST /api/v1/workspace/api-keys
    await new Promise((res) => setTimeout(res, 800))
    const rand = Math.random().toString(36).slice(2, 18).padEnd(16, '0')
    setApiKey(`zeno_live_${rand}`)
    setGenerating(false)
  }

  function handleCopy() {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maskedKey = apiKey
    ? `zeno_live_${'*'.repeat(16)}`
    : null

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings size={15} style={{ color: '#c9a84c' }} />
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: '#7a95b0' }}
            >
              Settings · Workspace
            </span>
          </div>
          <h1 className="text-xl font-semibold text-balance" style={{ color: '#f0f4f8' }}>
            Workspace Configuration
          </h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
            Manage your neural engines, integrations, and workspace identity.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {saved && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono"
              style={{ background: 'rgba(74,156,93,0.12)', color: '#4a9c5d', border: '1px solid rgba(74,156,93,0.25)' }}
            >
              <Check size={12} /> Saved
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.35)',
              color: '#c9a84c',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.25)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.15)')
            }
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* General */}
        <SectionCard title="General" icon={Settings}>
          <div className="flex flex-col gap-4">
            <Field
              label="Workspace Name"
              value={workspaceName}
              onChange={setWorkspaceName}
            />
            <Field
              label="Primary Industry"
              value={industry}
              onChange={setIndustry}
              hint="Used by Oracle to focus lead research and content generation."
            />
          </div>
        </SectionCard>

        {/* Neural Engine Controls */}
        <SectionCard title="Neural Engine Controls" icon={Cpu}>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono mb-1" style={{ color: '#7a95b0' }}>
              Toggle individual agents on or off. Pausing an agent stops all scheduled tasks
              for that module but preserves existing data.
            </p>
            <EngineToggle
              label="Oracle"
              description="Lead research, web scraping, and market intelligence"
              icon={Search}
              active={oracleActive}
              onChange={setOracleActive}
            />
            <EngineToggle
              label="COO"
              description="Task management, kanban automation, and ops workflows"
              icon={KanbanSquare}
              active={cooActive}
              onChange={setCooActive}
            />
            <EngineToggle
              label="CFO"
              description="Financial ledger, cash flow analysis, and invoice parsing"
              icon={BookOpen}
              active={cfoActive}
              onChange={setCfoActive}
            />
          </div>
        </SectionCard>

        {/* API Integrations */}
        <SectionCard title="API Integrations" icon={Key}>
          <div className="flex flex-col gap-4">
            <p className="text-xs font-mono" style={{ color: '#7a95b0' }}>
              Use this key to authenticate requests to the Zeno OS API from external tools and
              automations. Keep it secret — it will only be shown once.
            </p>

            {/* Key display */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(201,168,76,0.04)',
                border: '1px solid rgba(201,168,76,0.15)',
              }}
            >
              <code
                className="flex-1 text-sm font-mono truncate"
                style={{ color: apiKey ? '#c9a84c' : '#7a95b0' }}
              >
                {apiKey ? maskedKey : 'No key generated yet'}
              </code>
              {apiKey && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono flex-shrink-0 transition-all"
                  style={{
                    background: copied ? 'rgba(74,156,93,0.12)' : 'rgba(201,168,76,0.1)',
                    border: `1px solid ${copied ? 'rgba(74,156,93,0.3)' : 'rgba(201,168,76,0.25)'}`,
                    color: copied ? '#4a9c5d' : '#c9a84c',
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            <button
              onClick={handleGenerateKey}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold self-start transition-all disabled:opacity-60"
              style={{
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#c9a84c',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.2)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.12)')
              }
            >
              <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
              {generating ? 'Generating...' : apiKey ? 'Regenerate API Key' : 'Generate API Key'}
            </button>

            {apiKey && (
              <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                For security, the full key is shown in the clipboard only. Regenerating will
                invalidate the previous key immediately.
              </p>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
