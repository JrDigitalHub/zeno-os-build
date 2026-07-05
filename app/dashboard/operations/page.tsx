'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, KanbanSquare, ChevronRight, ChevronLeft, AlignLeft, MessageSquare } from 'lucide-react'
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

type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
type Status = 'backlog' | 'in-progress' | 'completed'
type SubscriptionTier = 'Trial' | 'Starter' | 'Professional'

type Task = {
  id: number
  title: string
  description: string
  priority: Priority
  assignee: string
  createdAt: string
  status: Status
}

type Board = Record<Status, Task[]>

const EMPTY_BOARD: Board = {
  backlog: [],
  'in-progress': [],
  completed: [],
}

// ── Priority badge ─────────────────────────────────────────────────────────

const PRIORITY_MAP: Record<Priority, { bg: string; color: string }> = {
  Critical: { bg: 'rgba(224,82,82,0.12)',  color: '#e05252' },
  High:     { bg: 'rgba(201,168,76,0.12)', color: '#c9a84c' },
  Medium:   { bg: 'rgba(74,156,93,0.12)',  color: '#4a9c5d' },
  Low:      { bg: 'rgba(122,149,176,0.12)',color: '#7a95b0' },
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const s = PRIORITY_MAP[priority]
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider flex-shrink-0"
      style={{ background: s.bg, color: s.color }}
    >
      {priority}
    </span>
  )
}

// ── Skeleton card (used during loading) ────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: '#0f2035', border: '1px solid rgba(201,168,76,0.08)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-4 w-14 rounded-full flex-shrink-0" />
      </div>
      <Skeleton className="h-2.5 w-full mb-1.5" />
      <Skeleton className="h-2.5 w-4/5 mb-4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
        <Skeleton className="h-2.5 w-28" />
      </div>
    </div>
  )
}

// ── Task card ──────────────────────────────────────────────────────────────

function TaskCard({
  task,
  col,
  onMove,
}: {
  task: Task
  col: Status
  onMove: (task: Task, from: Status, dir: 'forward' | 'back') => void
}) {
  const cols: Status[] = ['backlog', 'in-progress', 'completed']
  const idx = cols.indexOf(col)
  const canForward = idx < cols.length - 1
  const canBack = idx > 0

  return (
    <div
      className="rounded-xl p-4 transition-all group"
      style={{ background: '#0f2035', border: '1px solid rgba(201,168,76,0.13)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold leading-snug" style={{ color: '#f0f4f8' }}>
          {task.title}
        </p>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: '#7a95b0' }}>
        {task.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold"
            style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}
          >
            {task.assignee.split(' ').map((p) => p[0]).join('')}
          </div>
          <span className="text-[11px] font-mono" style={{ color: '#7a95b0' }}>
            {task.assignee} · {task.createdAt}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canBack && (
            <button
              onClick={() => onMove(task, col, 'back')}
              className="p-1 rounded-md"
              style={{ color: '#7a95b0', background: 'rgba(122,149,176,0.1)' }}
              title="Move back"
            >
              <ChevronLeft size={13} />
            </button>
          )}
          {canForward && (
            <button
              onClick={() => onMove(task, col, 'forward')}
              className="p-1 rounded-md"
              style={{ color: '#c9a84c', background: 'rgba(201,168,76,0.1)' }}
              title="Move forward"
            >
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Column header config ────────────────────────────────────────────────────

const COL_META: Record<Status, { label: string; accent: string; dot: string }> = {
  backlog:       { label: 'Backlog',     accent: 'rgba(122,149,176,0.15)', dot: '#7a95b0' },
  'in-progress': { label: 'In Progress', accent: 'rgba(201,168,76,0.12)',  dot: '#c9a84c' },
  completed:     { label: 'Completed',   accent: 'rgba(74,156,93,0.12)',   dot: '#4a9c5d' },
}

// ── Column ─────────────────────────────────────────────────────────────────

function Column({
  col,
  tasks,
  onMove,
  isLoading,
}: {
  col: Status
  tasks: Task[]
  onMove: (task: Task, from: Status, dir: 'forward' | 'back') => void
  isLoading: boolean
}) {
  const meta = COL_META[col]
  return (
    <div className="flex flex-col min-w-0">
      {/* Column header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
        style={{ background: meta.accent }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#f0f4f8' }}>
            {meta.label}
          </span>
        </div>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.07)', color: '#7a95b0' }}
        >
          {isLoading ? '–' : tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          // Loading skeleton cards
          Array.from({ length: col === 'in-progress' ? 2 : 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : tasks.length === 0 ? (
          // ── Empty state: dashed drop zone ──
          <div
            className="flex flex-col items-center justify-center py-10 rounded-xl gap-2"
            style={{
              border: '1.5px dashed rgba(201,168,76,0.18)',
              background: 'rgba(201,168,76,0.02)',
            }}
          >
            <AlignLeft size={18} style={{ color: 'rgba(201,168,76,0.2)' }} />
            <p className="text-[11px] font-mono" style={{ color: 'rgba(122,149,176,0.45)' }}>
              Drop tasks here
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} col={col} onMove={onMove} />
          ))
        )}
      </div>
    </div>
  )
}

// ── Create task modal ──────────────────────────────────────────────────────

const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low']
let nextId = 100

function CreateModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (t: Task) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [assignee, setAssignee] = useState('')

  function handleSubmit() {
    if (!title.trim()) return
    onCreate({
      id: ++nextId,
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      priority,
      assignee: assignee.trim() || 'Unassigned',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'backlog',
    })
    onClose()
  }

  const inputStyle = {
    background: 'rgba(201,168,76,0.06)',
    border: '1px solid rgba(201,168,76,0.18)',
    color: '#f0f4f8',
    outline: 'none',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: '#0f2035',
          border: '1px solid rgba(201,168,76,0.2)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}
        >
          <div className="flex items-center gap-2.5">
            <Plus size={15} style={{ color: '#c9a84c' }} />
            <span className="text-sm font-semibold" style={{ color: '#f0f4f8' }}>
              Create Task
            </span>
          </div>
          <button onClick={onClose} style={{ color: '#7a95b0' }} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Integrate payment gateway"
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)')}
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Briefly describe the task..."
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} style={{ background: '#0f2035' }}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#7a95b0' }}>
                Assignee
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="e.g. J. Reeves"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)')}
              />
            </div>
          </div>
        </div>
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium"
            style={{ color: '#7a95b0', border: '1px solid rgba(122,149,176,0.2)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-5 py-2 rounded-lg text-xs font-semibold disabled:opacity-40"
            style={{ background: '#c9a84c', color: '#0b1929' }}
          >
            Add to Backlog
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

const COLS: Status[] = ['backlog', 'in-progress', 'completed']

export default function OperationsPage() {
  const router = useRouter()
  const { consumeTokens } = useTokenVault()
  const { subscriptionTier, tokenLimitHit } = useAppContext()

  const [board, setBoard] = useState<Board>(EMPTY_BOARD)
  const [modalOpen, setModalOpen] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)

  // ── Real task loading from Go backend ──────────────────────────────────
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    apiClient
      .get<any>('/api/v1/sentinel/tasks')
      .then((data) => {
        if (cancelled) return
        
        const mappedTasks: Task[] = (Array.isArray(data) ? data : data?.tasks ?? []).map((t: any, index: number) => {
          const rawId = typeof t.id === 'number' ? t.id : parseInt(String(t.id).replace(/\D/g, '')) || (index + 1);
          
          const rawPriority = String(t.priority || 'Medium').toLowerCase();
          const priorityMap: Record<string, Priority> = {
            critical: 'Critical',
            high: 'High',
            medium: 'Medium',
            low: 'Low'
          };
          const priority = priorityMap[rawPriority] || 'Medium';

          const rawStatus = String(t.status || 'backlog').toLowerCase().replace('_', '-');
          let status: Status = 'backlog';
          if (rawStatus === 'in-progress' || rawStatus === 'in_progress' || rawStatus === 'active') {
            status = 'in-progress';
          } else if (rawStatus === 'completed' || rawStatus === 'done') {
            status = 'completed';
          }

          return {
            id: rawId,
            title: t.title || 'Untitled Task',
            description: t.description || t.title || 'No description provided.',
            priority,
            assignee: t.assignee || t.team || 'S. Chen',
            createdAt: t.createdAt || t.date || 'Jun 30',
            status,
          };
        });

        setBoard({
          backlog: mappedTasks.filter((t) => t.status === 'backlog'),
          'in-progress': mappedTasks.filter((t) => t.status === 'in-progress'),
          completed: mappedTasks.filter((t) => t.status === 'completed'),
        });
      })
      .catch((err) => {
        if (!cancelled) {
          toast({
            variant: 'error',
            title: 'Failed to load tasks',
            description: err instanceof Error ? err.message : 'Error fetching from backend.',
          })
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])


  // ── Independent COO trial counter ──────────────────────────────────────
  const [cooTaskCount, setCooTaskCount] = useState(0)
  const isTrialLocked =
    (subscriptionTier === 'Trial' && cooTaskCount >= TRIAL_LIMIT) || tokenLimitHit

  function recordCooAction(): boolean {
    if (subscriptionTier !== 'Trial') {
      consumeTokens('COO_TASK')
      return false
    }
    if (cooTaskCount >= TRIAL_LIMIT) {
      // Warn the user instead of silently failing
      toast({
        variant: 'warning',
        title: 'Token limit reached.',
        description: 'Please upgrade to continue.',
      })
      return true
    }
    setCooTaskCount((c) => c + 1)
    consumeTokens('COO_TASK')
    return false
  }

  function goToBilling() {
    router.push('/dashboard/billing')
  }

  function moveTask(task: Task, from: Status, dir: 'forward' | 'back') {
    if (recordCooAction()) return
    const cols: Status[] = ['backlog', 'in-progress', 'completed']
    const fromIdx = cols.indexOf(from)
    const to = cols[dir === 'forward' ? fromIdx + 1 : fromIdx - 1]
    if (!to) return
    setBoard((prev) => ({
      ...prev,
      [from]: prev[from].filter((t) => t.id !== task.id),
      [to]: [...prev[to], task],
    }))
  }

  function addTask(task: Task) {
    if (recordCooAction()) return
    setBoard((prev) => ({ ...prev, backlog: [task, ...prev.backlog] }))
    // ── Success toast ──
    toast({
      variant: 'success',
      title: 'Task added to queue',
      description: `"${task.title}" is now in the backlog.`,
    })
  }

  const total = COLS.reduce((sum, col) => sum + board[col].length, 0)

  return (
    <>
      {modalOpen && (
        <CreateModal onClose={() => setModalOpen(false)} onCreate={addTask} />
      )}

      {/* ── Mobile terminal Sheet (slides up from bottom on < lg) ── */}
      <Sheet open={terminalOpen} onOpenChange={setTerminalOpen}>
        <SheetContent side="bottom" className="p-0 flex flex-col">
          <SheetHeader className="px-4 pt-4 pb-3 border-b border-[rgba(201,168,76,0.12)]">
            <SheetTitle style={{ color: '#f0f4f8' }}>COO Agent Terminal</SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0">
            <DirectAgentTerminal
              agentRole="COO"
              className="border-l-0"
              onCommandSent={() => recordCooAction()}
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-57px)]">
        {/* ── Main content (full width on mobile, 70% on lg+) ── */}
        <div className="flex-1 overflow-y-auto min-w-0">
          <div className="p-4 sm:p-6">

            {/* Trial / Starter banners */}
            {subscriptionTier === 'Trial' && cooTaskCount < TRIAL_LIMIT && (
              <TrialCreditBanner
                used={cooTaskCount}
                agentName="COO"
                actionLabel="COO Tasks"
                onDevIncrease={() => recordCooAction()}
                onUpgrade={goToBilling}
              />
            )}
            {subscriptionTier === 'Starter' && (
              <StarterCreditBanner used={15} total={50} agentName="COO" />
            )}

            {/* Page header */}
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <KanbanSquare size={16} style={{ color: '#c9a84c' }} />
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
                    COO · Operations Board
                  </span>
                </div>
                <h1 className="text-xl font-semibold" style={{ color: '#f0f4f8' }}>
                  Task Management
                </h1>
                <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
                  {isLoading ? '—' : `${total} active tasks across ${COLS.length} stages`}
                </p>
              </div>
              <button
                onClick={() => {
                  if (isTrialLocked) return
                  setModalOpen(true)
                }}
                disabled={isTrialLocked || isLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#c9a84c', color: '#0b1929' }}
              >
                <Plus size={15} />
                Create Task
              </button>
            </div>

            {/* Kanban board */}
            <div className="relative">
              {isTrialLocked && (
                <TrialLockOverlay
                  agentName="COO"
                  actionLabel="COO tasks"
                  onUpgrade={goToBilling}
                />
              )}

              {/* grid-cols-1 on mobile, 3 columns on md+ */}
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                style={
                  isTrialLocked
                    ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }
                    : {}
                }
              >
                {COLS.map((col) => (
                  <Column
                    key={col}
                    col={col}
                    tasks={board[col]}
                    onMove={moveTask}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop terminal (hidden on < lg) ── */}
        <div className="hidden lg:flex w-[30%] flex-shrink-0">
          <DirectAgentTerminal
            agentRole="COO"
            onCommandSent={() => recordCooAction()}
          />
        </div>
      </div>

      {/* ── Mobile floating "Chat with COO" button (hidden on lg+) ── */}
      <button
        id="coo-mobile-chat-fab"
        onClick={() => setTerminalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold shadow-2xl transition-all"
        style={{
          background: 'linear-gradient(135deg, #20b2aa, #178f88)',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(32,178,170,0.4)',
        }}
        aria-label="Chat with COO Agent"
      >
        <MessageSquare size={16} />
        Chat with COO
      </button>
    </>
  )
}
