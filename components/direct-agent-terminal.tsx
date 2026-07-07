'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Terminal, Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient, ApiError } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import { useAppContext } from '@/context/AppContext'

// ── Types ──────────────────────────────────────────────────────────────────

export type AgentRole = 'Oracle' | 'COO' | 'CFO'

interface Message {
  id: number
  role: 'agent' | 'user'
  text: string
  timestamp: string
}

// ── Role configuration ─────────────────────────────────────────────────────

const AGENT_CONFIG: Record<
  AgentRole,
  {
    color: string
    label: string
    sublabel: string
    greeting: string
    avatar: string
  }
> = {
  Oracle: {
    color: '#c9a84c',
    label: 'Oracle',
    sublabel: 'Research Intelligence',
    avatar: '◈',
    greeting:
      'Neural research engine online. I can scan the web for leads, enrich contact data, and draft outreach. What target domain or keyword should I investigate?',
  },
  COO: {
    color: '#20b2aa',
    label: 'COO Agent',
    sublabel: 'Operations Director',
    avatar: '⬡',
    greeting:
      'Operations command centre active. I monitor your task pipeline, flag blockers, and automate workflow decisions. What would you like me to prioritise today?',
  },
  CFO: {
    color: '#4a9c5d',
    label: 'CFO Agent',
    sublabel: 'Financial Intelligence',
    avatar: '◆',
    greeting:
      'Financial intelligence module online. I analyse your cash flow, flag anomalies, and surface actionable insights from your ledger. What would you like to examine?',
  },
}

function getTimestamp() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

let _msgId = 1
function nextId() { return _msgId++ }

// ── Terminal component ─────────────────────────────────────────────────────

export default function DirectAgentTerminal({
  agentRole,
  onCommandSent,
  className = '',
}: {
  agentRole: AgentRole
  onCommandSent?: () => void
  /** Extra class names — useful when embedding inside the mobile Sheet */
  className?: string
}) {
  const { user } = useAppContext()
  const workspaceId = user?.workspace_id
  const cfg = AGENT_CONFIG[agentRole]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId(),
      role: 'agent',
      text: cfg.greeting,
      timestamp: getTimestamp(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isTyping) return

    onCommandSent?.()

    const userMsg: Message = {
      id: nextId(),
      role: 'user',
      text,
      timestamp: getTimestamp(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const data = await apiClient.post<{ response: string }>('/api/v1/chat', {
        workspace_id: workspaceId || '',
        agent_type: agentRole,
        message: text,
      })

      const agentMsg: Message = {
        id: nextId(),
        role: 'agent',
        text: data.response,
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, agentMsg])
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        // Token limit hit — fire toast; api-client already set tokenLimitHit
        toast({
          title: 'Token limit reached. Please upgrade to continue.',
          variant: 'error',
        })
      } else {
        // Surface generic errors inline as an agent message
        const errorMsg: Message = {
          id: nextId(),
          role: 'agent',
          text: err instanceof ApiError
            ? err.message
            : 'An unexpected error occurred. Please try again.',
          timestamp: getTimestamp(),
        }
        setMessages((prev) => [...prev, errorMsg])
      }
    } finally {
      setIsTyping(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div
      className={`flex flex-col h-full ${className}`}
      style={{
        background: '#0a1929',
        borderLeft: '1px solid rgba(201,168,76,0.12)',
        minHeight: 0,
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          background: 'rgba(11,25,41,0.8)',
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{
            background: `${cfg.color}18`,
            border: `1px solid ${cfg.color}40`,
            color: cfg.color,
            fontFamily: 'monospace',
          }}
        >
          {cfg.avatar}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold" style={{ color: '#f0f4f8' }}>
              {cfg.label}
            </p>
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: cfg.color,
                boxShadow: `0 0 4px ${cfg.color}`,
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          </div>
          <p className="text-[10px] font-mono truncate" style={{ color: '#7a95b0' }}>
            {cfg.sublabel}
          </p>
        </div>

        <div className="ml-auto flex-shrink-0">
          <Terminal size={13} style={{ color: '#7a95b0' }} />
        </div>
      </div>

      {/* ── Message canvas ── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className="max-w-[90%] px-3 py-2.5 rounded-xl text-xs leading-relaxed"
              style={
                msg.role === 'agent'
                  ? {
                      background: 'rgba(201,168,76,0.05)',
                      border: `1px solid ${cfg.color}20`,
                      color: '#c0cdd8',
                      borderRadius: '4px 12px 12px 12px',
                    }
                  : {
                      background: 'rgba(122,149,176,0.12)',
                      border: '1px solid rgba(122,149,176,0.2)',
                      color: '#f0f4f8',
                      borderRadius: '12px 4px 12px 12px',
                    }
              }
            >
              {msg.role === 'agent' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={9} style={{ color: cfg.color }} />
                  <span
                    className="text-[9px] font-mono uppercase tracking-widest"
                    style={{ color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
              )}
              <p style={{ fontFamily: msg.role === 'agent' ? 'monospace' : 'inherit', fontSize: '11px', lineHeight: 1.6 }}>
                {msg.text}
              </p>
            </div>

            <span className="text-[9px] font-mono px-1" style={{ color: 'rgba(122,149,176,0.4)' }}>
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* ── Skeleton typing indicator (replaces plain dots) ── */}
        {isTyping && (
          <div className="flex items-start">
            <div
              className="px-3 py-2.5 w-[78%]"
              style={{
                background: 'rgba(201,168,76,0.05)',
                border: `1px solid ${cfg.color}20`,
                borderRadius: '4px 12px 12px 12px',
              }}
            >
              {/* Agent label */}
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={9} style={{ color: cfg.color }} />
                <Skeleton className="h-2 w-12" style={{ background: `${cfg.color}25` }} />
              </div>
              {/* Simulated text lines */}
              <Skeleton className="h-2.5 w-full mb-1.5" />
              <Skeleton className="h-2.5 w-5/6 mb-1.5" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <div
        className="flex-shrink-0 px-3 pb-3 pt-2"
        style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}
      >
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            background: 'rgba(201,168,76,0.04)',
            border: '1px solid rgba(201,168,76,0.15)',
            transition: 'border-color 0.2s',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Command ${cfg.label}…`}
            disabled={isTyping}
            className="flex-1 bg-transparent outline-none text-xs font-mono placeholder:opacity-40 disabled:opacity-50"
            style={{ color: '#f0f4f8' }}
            onFocus={(e) => {
              const parent = e.currentTarget.closest('div') as HTMLElement
              if (parent) parent.style.borderColor = `${cfg.color}50`
            }}
            onBlur={(e) => {
              const parent = e.currentTarget.closest('div') as HTMLElement
              if (parent) parent.style.borderColor = 'rgba(201,168,76,0.15)'
            }}
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold font-mono uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            style={{ background: '#c9a84c', color: '#0b1929' }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled)
                (e.currentTarget as HTMLElement).style.background = '#d4b560'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#c9a84c'
            }}
          >
            <Send size={10} />
            Send
          </button>
        </div>

        <p className="text-[9px] font-mono text-center mt-1.5" style={{ color: 'rgba(122,149,176,0.35)' }}>
          Press Enter to send · Powered by Gemini
        </p>
      </div>
    </div>
  )
}
