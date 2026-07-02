'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Terminal, Sparkles } from 'lucide-react'

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
    responses: string[]
  }
> = {
  Oracle: {
    color: '#c9a84c',
    label: 'Oracle',
    sublabel: 'Research Intelligence',
    avatar: '◈',
    greeting:
      'Neural research engine online. I can scan the web for leads, enrich contact data, and draft outreach. What target domain or keyword should I investigate?',
    responses: [
      'Scanning target domain for decision-makers and org structure. Stand by — enrichment in progress.',
      'Identified 7 high-confidence leads matching your criteria. Scores range from 74 to 95. Shall I draft outreach for the top three?',
      'Pattern analysis complete. This vertical shows strong conversion signals in Q3. I recommend prioritising VP-level contacts.',
      'Domain intelligence retrieved. Company uses Salesforce and HubSpot — warm intro pathway available through mutual connections.',
      'Lead scoring model updated. Filtering out unverified contacts. Enriched dataset ready for export.',
      'Research complete. I found 3 untapped channels in this niche. Want me to generate an outreach sequence?',
    ],
  },
  COO: {
    color: '#20b2aa',
    label: 'COO Agent',
    sublabel: 'Operations Director',
    avatar: '⬡',
    greeting:
      'Operations command centre active. I monitor your task pipeline, flag blockers, and automate workflow decisions. What would you like me to prioritise today?',
    responses: [
      'Reviewing task backlog. I spotted 2 critical items with no assignee — recommend escalating before end of day.',
      'Workflow bottleneck detected in the In Progress column. The data warehouse migration has been stalled for 48 hours. Should I re-prioritise resources?',
      'Team capacity analysis complete. Current sprint is 87% utilised. Adding new tasks may delay the Q3 milestone.',
      'Automated SLA draft generated based on your existing contracts. Review and approve before client send.',
      'Kanban health score: 72/100. Recommend moving 2 backlog items to In Progress to maintain velocity.',
      'Onboarding task dependencies mapped. 3 subtasks can be parallelised. Estimated completion 2 days earlier if executed concurrently.',
    ],
  },
  CFO: {
    color: '#4a9c5d',
    label: 'CFO Agent',
    sublabel: 'Financial Intelligence',
    avatar: '◆',
    greeting:
      'Financial intelligence module online. I analyse your cash flow, flag anomalies, and surface actionable insights from your ledger. What would you like to examine?',
    responses: [
      'Cash flow analysis complete. Net positive this month at £3,750. However, payroll in 3 days will create a temporary negative position.',
      'Anomaly detected: the R&D contractor charge is 34% above the monthly average. Want me to flag this for review?',
      'Revenue trend is up 18% MoM. Primary driver is the Apex Systems enterprise contract. Recommend upsell opportunity.',
      'Burn rate model updated. At current spend velocity, runway extends 14 months. Healthy position.',
      'Tax optimisation opportunity identified: 3 expenses in the Legal category are reclassifiable. Potential saving: £1,200.',
      'Bank sync recommendation: automating reconciliation would save approximately 6 hours of manual work per month.',
    ],
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
}: {
  agentRole: AgentRole
  onCommandSent?: () => void
}) {
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
  const responseIdxRef = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function sendMessage() {
    const text = input.trim()
    if (!text || isTyping) return

    // Notify parent — used to consume a trial credit
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

    // Simulate agent response delay (1–2.2s)
    const delay = 1000 + Math.random() * 1200
    setTimeout(() => {
      const responses = cfg.responses
      const responseText = responses[responseIdxRef.current % responses.length]
      responseIdxRef.current++

      const agentMsg: Message = {
        id: nextId(),
        role: 'agent',
        text: responseText,
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, agentMsg])
      setIsTyping(false)
    }, delay)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div
      className="flex flex-col h-full"
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
        {/* Avatar orb */}
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
            {/* Live indicator */}
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
            {/* Bubble */}
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
                <div
                  className="flex items-center gap-1.5 mb-1.5"
                >
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

            {/* Timestamp */}
            <span className="text-[9px] font-mono px-1" style={{ color: 'rgba(122,149,176,0.4)' }}>
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="px-3 py-2.5 rounded-xl" style={{
              background: 'rgba(201,168,76,0.05)',
              border: `1px solid ${cfg.color}20`,
              borderRadius: '4px 12px 12px 12px',
            }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={9} style={{ color: cfg.color }} />
                <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
              <div className="flex items-center gap-1 py-0.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: cfg.color,
                      opacity: 0.7,
                      animation: `typingBounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
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
          onFocus={() => {}}
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
            style={{
              background: '#c9a84c',
              color: '#0b1929',
            }}
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
          Press Enter to send · AI responses are simulated
        </p>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}
