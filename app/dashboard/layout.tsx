'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Search,
  KanbanSquare,
  BookOpen,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User,
  Plug,
} from 'lucide-react'
import { NeuralFeed } from '@/components/neural-feed'

const NAV_ITEMS = [
  { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Oracle Research', href: '/dashboard/oracle', icon: Search },
  { label: 'COO Kanban', href: '/dashboard/operations', icon: KanbanSquare },
  { label: 'CFO Ledger', href: '/dashboard/financials', icon: BookOpen },
  { label: 'Integrations', href: '/dashboard/integrations', icon: Plug },
]

const WORKSPACE_NAME = 'Acme Corp'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setUserMenuOpen(false)
    setSigningOut(true)
    // TODO: call your auth sign-out endpoint here before redirecting
    await new Promise((res) => setTimeout(res, 1200))
    router.push('/login')
  }

  const activePage = NAV_ITEMS.find((item) => item.href === pathname)?.label ?? 'Dashboard'

  return (
    <div className="flex min-h-screen" style={{ background: '#0b1929' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-56 flex flex-col
          transition-transform duration-300
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: '#0f2035',
          borderRight: '1px solid rgba(201,168,76,0.12)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5 border-b"
          style={{ borderColor: 'rgba(201,168,76,0.12)' }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zeno-logo-lkiAE73bRovt0MDeLabqYwMQSuit6L.png"
            alt="Zeno OS"
            width={28}
            height={28}
            className="flex-shrink-0"
          />
          <div>
            <p
              className="text-xs font-mono font-semibold uppercase tracking-widest leading-tight"
              style={{ color: '#c9a84c' }}
            >
              Zeno OS
            </p>
            <p className="text-[10px] font-mono" style={{ color: '#7a95b0' }}>
              Neural OS
            </p>
          </div>
        </div>

        {/* Nav label */}
        <p
          className="px-5 pt-5 pb-2 text-[10px] font-mono uppercase tracking-widest"
          style={{ color: 'rgba(122,149,176,0.5)' }}
        >
          Navigation
        </p>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: isActive ? '#c9a84c' : '#7a95b0',
                  borderLeft: isActive ? '2px solid #c9a84c' : '2px solid transparent',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span className="font-medium text-[13px]">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div
          className="px-3 py-4 border-t"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}
        >
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
            style={{ color: '#7a95b0' }}
            onMouseEnter={(e) => {
              if (signingOut) return
              ;(e.currentTarget as HTMLElement).style.color = '#e05252'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(224,82,82,0.07)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = '#7a95b0'
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <LogOut size={15} />
            <span className="text-[13px]">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ── Top bar ── */}
        <header
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{
            background: 'rgba(11,25,41,0.8)',
            borderColor: 'rgba(201,168,76,0.1)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-1.5 rounded-md"
              style={{ color: '#7a95b0' }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono" style={{ color: 'rgba(122,149,176,0.5)' }}>
                WORKSPACE
              </span>
              <span
                className="h-3 w-px"
                style={{ background: 'rgba(201,168,76,0.2)' }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: '#f0f4f8' }}
              >
                {WORKSPACE_NAME}
              </span>
              <span
                className="hidden sm:inline text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c' }}
              >
                {activePage}
              </span>
            </div>
          </div>

          {/* Right: system status + user */}
          <div className="flex items-center gap-3">
            {/* Neural status indicator */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4a9c5d' }} />
              <span className="text-xs font-mono" style={{ color: '#4a9c5d' }}>
                All systems nominal
              </span>
            </div>

            <div
              className="h-4 w-px hidden md:block"
              style={{ background: 'rgba(201,168,76,0.15)' }}
            />

            {/* Neural Feed */}
            <NeuralFeed />

            <div
              className="h-4 w-px"
              style={{ background: 'rgba(201,168,76,0.15)' }}
            />

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: userMenuOpen
                    ? 'rgba(201,168,76,0.1)'
                    : 'rgba(201,168,76,0.05)',
                  border: '1px solid rgba(201,168,76,0.15)',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(201,168,76,0.15)' }}
                >
                  <User size={13} style={{ color: '#c9a84c' }} />
                </div>
                <span className="text-xs font-mono hidden sm:inline" style={{ color: '#c0cdd8' }}>
                  admin
                </span>
                <ChevronDown
                  size={13}
                  style={{
                    color: '#7a95b0',
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 200ms',
                  }}
                />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50"
                  style={{
                    background: '#0f2035',
                    border: '1px solid rgba(201,168,76,0.18)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    className="px-4 py-3 border-b"
                    style={{ borderColor: 'rgba(201,168,76,0.1)' }}
                  >
                    <p className="text-xs font-semibold" style={{ color: '#f0f4f8' }}>
                      Admin User
                    </p>
                    <p className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
                      admin@acmecorp.com
                    </p>
                  </div>
                  <div className="py-1.5">
                    {[
                      { label: 'Profile Settings', href: '/dashboard/profile' },
                      { label: 'Workspace Config', href: '/dashboard/workspace' },
                      { label: 'Billing',           href: '/dashboard/billing' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full text-left px-4 py-2 text-xs transition-all"
                        style={{ color: '#c0cdd8' }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background =
                            'rgba(201,168,76,0.08)'
                          ;(e.currentTarget as HTMLElement).style.color = '#f0f4f8'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                          ;(e.currentTarget as HTMLElement).style.color = '#c0cdd8'
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div
                      className="mx-3 my-1 h-px"
                      style={{ background: 'rgba(201,168,76,0.1)' }}
                    />
                    <button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="w-full text-left px-4 py-2 text-xs transition-all disabled:opacity-50"
                      style={{ color: '#e05252' }}
                    >
                      {signingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile sidebar close button */}
            {sidebarOpen && (
              <button
                className="lg:hidden p-1.5"
                style={{ color: '#7a95b0' }}
                onClick={() => setSidebarOpen(false)}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </header>

        {/* ── Canvas ── */}
        <main className="flex-1 overflow-auto" style={{ background: '#0d1e30' }}>
          {children}
        </main>
      </div>

      {/* ── Sign-out overlay ── */}
      {signingOut && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
          style={{ background: 'rgba(11,25,41,0.92)', backdropFilter: 'blur(6px)' }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zeno-logo-lkiAE73bRovt0MDeLabqYwMQSuit6L.png"
            alt="Zeno OS"
            width={40}
            height={40}
            className="opacity-80"
          />
          <p className="text-sm font-mono" style={{ color: '#c9a84c' }}>
            Signing out...
          </p>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  background: '#c9a84c',
                  animationDelay: `${i * 120}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
