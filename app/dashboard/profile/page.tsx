'use client'

import { useState, useEffect } from 'react'
import { User, Lock, Bell, Check } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import { useAppContext } from '@/context/AppContext'

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
  type = 'text',
  placeholder,
  onChange,
  readOnly,
}: {
  label: string
  value: string
  type?: string
  placeholder?: string
  onChange?: (v: string) => void
  readOnly?: boolean
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
        placeholder={placeholder}
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
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium" style={{ color: '#c0cdd8' }}>
          {label}
        </p>
        <p className="text-[11px] font-mono mt-0.5" style={{ color: '#7a95b0' }}>
          {description}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 w-10 h-5.5 rounded-full transition-all duration-200"
        style={{
          background: checked ? 'rgba(201,168,76,0.3)' : 'rgba(122,149,176,0.2)',
          border: `1px solid ${checked ? 'rgba(201,168,76,0.6)' : 'rgba(122,149,176,0.3)'}`,
          width: 40,
          height: 22,
        }}
      >
        <span
          className="absolute top-0.5 rounded-full transition-all duration-200"
          style={{
            width: 16,
            height: 16,
            left: checked ? 22 : 2,
            background: checked ? '#c9a84c' : '#7a95b0',
          }}
        />
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { toast } = useToast()
  const { user } = useAppContext()

  // Personal info
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role] = useState('CEO')

  useEffect(() => {
    if (user) {
      setFullName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  // Security
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [leadSummaries, setLeadSummaries] = useState(true)
  const [billingNotifs, setBillingNotifs] = useState(false)

  // Save state
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    )
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      })
      if (authError) throw authError

      await apiClient.post<any>('/api/v1/profile/update', {
        name: fullName.trim(),
      })

      setSaved(true)
      toast({
        title: 'Profile Updated',
        description: 'Your profile settings have been successfully synced.',
        variant: 'success',
      })
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      toast({
        title: 'Failed to update profile',
        description: err.message || 'Something went wrong.',
        variant: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdatePassword() {
    if (!currentPw || !newPw || newPw !== confirmPw) return
    setPwSaving(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
    )
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPw,
      })
      if (error) throw error

      setPwSaved(true)
      toast({
        title: 'Password Updated',
        description: 'Your credentials have been updated successfully.',
        variant: 'success',
      })
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setTimeout(() => setPwSaved(false), 3000)
    } catch (err: any) {
      toast({
        title: 'Failed to update password',
        description: err.message || 'Something went wrong.',
        variant: 'error',
      })
    } finally {
      setPwSaving(false)
    }
  }

  const pwValid = currentPw && newPw && newPw === confirmPw


  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User size={15} style={{ color: '#c9a84c' }} />
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: '#7a95b0' }}
            >
              Settings · Profile
            </span>
          </div>
          <h1 className="text-xl font-semibold text-balance" style={{ color: '#f0f4f8' }}>
            Profile Settings
          </h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
            Manage your personal information and preferences.
          </p>
        </div>

        {/* Save button + toast */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {saved && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono"
              style={{ background: 'rgba(74,156,93,0.12)', color: '#4a9c5d', border: '1px solid rgba(74,156,93,0.25)' }}
            >
              <Check size={12} /> Changes saved
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
        {/* Personal Information */}
        <SectionCard title="Personal Information" icon={User}>
          <div className="flex flex-col gap-4">
            <Field label="Full Name" value={fullName} onChange={setFullName} />
            <Field label="Email Address" value={email} readOnly />
            <Field label="Role" value={role} readOnly />
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security" icon={Lock}>
          <div className="flex flex-col gap-4">
            <Field
              label="Current Password"
              type="password"
              value={currentPw}
              onChange={setCurrentPw}
              placeholder="Enter current password"
            />
            <Field
              label="New Password"
              type="password"
              value={newPw}
              onChange={setNewPw}
              placeholder="At least 8 characters"
            />
            <Field
              label="Confirm New Password"
              type="password"
              value={confirmPw}
              onChange={setConfirmPw}
              placeholder="Repeat new password"
            />
            {newPw && confirmPw && newPw !== confirmPw && (
              <p className="text-[11px] font-mono" style={{ color: '#e05252' }}>
                Passwords do not match.
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpdatePassword}
                disabled={!pwValid || pwSaving}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: '#c9a84c',
                }}
              >
                {pwSaving ? 'Updating...' : 'Update Password'}
              </button>
              {pwSaved && (
                <div
                  className="flex items-center gap-1.5 text-xs font-mono"
                  style={{ color: '#4a9c5d' }}
                >
                  <Check size={12} /> Password updated
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon={Bell}>
          <div
            className="divide-y"
            style={{ borderColor: 'rgba(201,168,76,0.08)' }}
          >
            <Toggle
              label="Email Alerts"
              description="Receive real-time system alerts via email"
              checked={emailAlerts}
              onChange={setEmailAlerts}
            />
            <Toggle
              label="Lead Generation Summaries"
              description="Daily digest of Oracle research activity"
              checked={leadSummaries}
              onChange={setLeadSummaries}
            />
            <Toggle
              label="Billing Notifications"
              description="Usage warnings and invoice receipts"
              checked={billingNotifs}
              onChange={setBillingNotifs}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
