'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
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
  Mail,
  Trash2,
  ShieldCheck,
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
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
  hint?: string
  type?: string
  placeholder?: string
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
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
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
  const { toast } = useToast()

  // General
  const [workspaceName, setWorkspaceName] = useState('')
  const [industry, setIndustry] = useState('')

  // Engine toggles
  const [oracleActive, setOracleActive] = useState(true)
  const [cooActive, setCooActive] = useState(true)
  const [cfoActive, setCfoActive] = useState(false)

  // API key
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  // SMTP Settings State
  const [smtpConfigured, setSmtpConfigured] = useState<boolean | null>(null)
  const [smtpHost, setSmtpHost] = useState('')
  const [smtpPort, setSmtpPort] = useState('')
  const [smtpUsername, setSmtpUsername] = useState('')
  const [smtpPassword, setSmtpPassword] = useState('')
  const [smtpSenderName, setSmtpSenderName] = useState('')
  const [savingSmtp, setSavingSmtp] = useState(false)
  const [deletingSmtp, setDeletingSmtp] = useState(false)

  // Load settings on mount
  useEffect(() => {
    let cancelled = false
    apiClient
      .get<any>('/api/v1/workspace/settings')
      .then((data) => {
        if (cancelled || !data) return
        setWorkspaceName(data.name || data.workspaceName || '')
        setIndustry(data.industry || '')
        setOracleActive(data.oracleActive ?? data.oracle_active ?? true)
        setCooActive(data.cooActive ?? data.coo_active ?? true)
        setCfoActive(data.cfoActive ?? data.cfo_active ?? false)
        if (data.apiKey || data.api_key) {
          setApiKey(data.apiKey || data.api_key)
        }
      })
      .catch((err) => {
        console.error('Failed to load workspace settings', err)
      })

    // Fetch SMTP Configuration Status
    apiClient
      .get<any>('/api/v1/settings/smtp')
      .then((data) => {
        if (cancelled || !data) return
        if (data.configured) {
          setSmtpConfigured(true)
          setSmtpHost(data.host || '')
          setSmtpPort(data.port || '')
          setSmtpUsername(data.username || '')
          setSmtpSenderName(data.sender_name || data.senderName || '')
        } else {
          setSmtpConfigured(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load SMTP settings', err)
        setSmtpConfigured(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Save General Workspace Settings
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await apiClient.patch('/api/v1/workspace/settings', {
        name: workspaceName.trim(),
        industry: industry.trim(),
        oracleActive,
        cooActive,
        cfoActive,
        oracle_active: oracleActive,
        coo_active: cooActive,
        cfo_active: cfoActive,
      })
      setSaved(true)
      toast({
        title: 'Settings Saved',
        description: 'Workspace configuration updated successfully.',
        variant: 'success',
      })
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      toast({
        title: 'Failed to save settings',
        description: err.message || 'Something went wrong.',
        variant: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle SMTP Credentials Save / Update
  async function handleSaveSmtp(e: React.FormEvent) {
    e.preventDefault()
    if (!smtpHost.trim() || !smtpPort.trim() || !smtpUsername.trim() || !smtpPassword.trim()) {
      toast({
        title: 'Validation Error',
        description: 'SMTP host, port, username, and password are required.',
        variant: 'error',
      })
      return
    }

    setSavingSmtp(true)
    try {
      const res = await apiClient.post<any>('/api/v1/settings/smtp', {
        host: smtpHost.trim(),
        port: smtpPort.trim(),
        username: smtpUsername.trim(),
        password: smtpPassword,
        sender_name: smtpSenderName.trim() || smtpUsername.trim(),
      })

      setSmtpConfigured(true)
      setSmtpPassword('') // Clear raw password input for security; never display back
      toast({
        title: 'SMTP Credentials Saved',
        description: res?.message || 'Custom SMTP configuration updated successfully.',
        variant: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Failed to save SMTP credentials',
        description: err.message || 'Something went wrong while saving SMTP settings.',
        variant: 'error',
      })
    } finally {
      setSavingSmtp(false)
    }
  }

  // Handle Delete Custom SMTP
  async function handleDeleteSmtp() {
    setDeletingSmtp(true)
    try {
      const res = await apiClient.delete<any>('/api/v1/settings/smtp')
      setSmtpConfigured(false)
      setSmtpHost('')
      setSmtpPort('')
      setSmtpUsername('')
      setSmtpPassword('')
      setSmtpSenderName('')
      toast({
        title: 'Custom SMTP Removed',
        description: res?.message || 'Reverted to system default SMTP configuration.',
        variant: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Failed to remove custom SMTP',
        description: err.message || 'Something went wrong while removing SMTP settings.',
        variant: 'error',
      })
    } finally {
      setDeletingSmtp(false)
    }
  }

  async function handleGenerateKey() {
    setGenerating(true)
    try {
      const data = await apiClient.post<any>('/api/v1/workspace/api-keys')
      const generatedKey = data?.key || data?.apiKey || data?.api_key || 'zeno_live_key_failed'
      setApiKey(generatedKey)
      toast({
        title: 'API Key Generated',
        description: 'New API key generated successfully. Copy it now.',
        variant: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Failed to generate key',
        description: err.message || 'Something went wrong.',
        variant: 'error',
      })
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy() {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maskedKey = apiKey
    ? apiKey.startsWith('zeno_live_')
      ? `zeno_live_${'*'.repeat(16)}`
      : '****************'
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

        {/* Custom SMTP Configuration */}
        <SectionCard title="Custom SMTP Configuration" icon={Mail}>
          <form onSubmit={handleSaveSmtp} className="flex flex-col gap-4">
            <div
              className="flex items-center justify-between gap-4 p-3.5 rounded-xl"
              style={{
                background: smtpConfigured ? 'rgba(74,156,93,0.06)' : 'rgba(201,168,76,0.03)',
                border: `1px solid ${smtpConfigured ? 'rgba(74,156,93,0.2)' : 'rgba(201,168,76,0.12)'}`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} style={{ color: smtpConfigured ? '#4a9c5d' : '#c9a84c' }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#f0f4f8' }}>
                    Status:{' '}
                    <span style={{ color: smtpConfigured ? '#4a9c5d' : '#7a95b0' }}>
                      {smtpConfigured === null
                        ? 'Checking configuration...'
                        : smtpConfigured
                        ? 'Custom SMTP configured'
                        : 'Using system default'}
                    </span>
                  </p>
                  <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                    {smtpConfigured
                      ? 'Outbound email dispatch uses your workspace custom SMTP server.'
                      : 'Outbound emails use system default mailer credentials.'}
                  </p>
                </div>
              </div>

              {smtpConfigured && (
                <button
                  type="button"
                  onClick={handleDeleteSmtp}
                  disabled={deletingSmtp}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono flex-shrink-0 transition-all disabled:opacity-60"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#ef4444',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)')
                  }
                >
                  <Trash2 size={13} />
                  {deletingSmtp ? 'Removing...' : 'Remove custom SMTP'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="SMTP Host"
                value={smtpHost}
                onChange={setSmtpHost}
                placeholder="e.g. smtp.zoho.com"
              />
              <Field
                label="SMTP Port"
                value={smtpPort}
                onChange={setSmtpPort}
                placeholder="e.g. 587 or 465"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Username / Email"
                value={smtpUsername}
                onChange={setSmtpUsername}
                placeholder="e.g. user@company.com"
              />
              <Field
                label="Password"
                type="password"
                value={smtpPassword}
                onChange={setSmtpPassword}
                placeholder={smtpConfigured ? '••••••••' : 'SMTP Password'}
                hint="Stored using AES-256 GCM encryption. Never returned to browser."
              />
            </div>

            <Field
              label="Sender Display Name"
              value={smtpSenderName}
              onChange={setSmtpSenderName}
              placeholder="e.g. Acme Corp Sales"
              hint="Optional. Defaults to username if left blank."
            />

            <div
              className="flex items-center justify-end gap-3 pt-3 border-t"
              style={{ borderColor: 'rgba(201,168,76,0.1)' }}
            >
              <button
                type="submit"
                disabled={savingSmtp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
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
                <Mail size={14} />
                {savingSmtp
                  ? 'Saving SMTP...'
                  : smtpConfigured
                  ? 'Update Custom SMTP'
                  : 'Save Custom SMTP'}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  )
}

