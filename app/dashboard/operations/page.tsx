'use client'

import { useState } from 'react'
import { Plus, X, KanbanSquare, ChevronRight, ChevronLeft, AlignLeft } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
type Status = 'backlog' | 'in-progress' | 'completed'

type Task = {
  id: number
  title: string
  description: string
  priority: Priority
  assignee: string
  createdAt: string
}

type Board = Record<Status, Task[]>

// ── Seed data ──────────────────────────────────────────────────────────────

const INITIAL_BOARD: Board = {
  backlog: [
    { id: 1, title: 'Audit Q3 vendor contracts', description: 'Review all active vendor agreements before renewal window.', priority: 'High', assignee: 'S. Chen', createdAt: 'Jun 28' },
    { id: 2, title: 'Set up Slack → CRM bridge', description: 'Automate deal stage updates from #sales channel.', priority: 'Medium', assignee: 'P. Nair', createdAt: 'Jun 29' },
    { id: 3, title: 'Draft SLA for new clients', description: 'Prepare standard service level agreement template.', priority: 'Low', assignee: 'A. Okonkwo', createdAt: 'Jun 30' },
  ],
  'in-progress': [
    { id: 4, title: 'Onboard three enterprise accounts', description: 'Coordinate kickoff calls and assign success managers.', priority: 'Critical', assignee: 'J. Reeves', createdAt: 'Jun 25' },
    { id: 5, title: 'Migrate data warehouse to v2', description: 'Schema migration and ETL pipeline updates required.', priority: 'High', assignee: 'D. Park', createdAt: 'Jun 26' },
  ],
  completed: [
    { id: 6, title: 'Launch Oracle beta access', description: 'Opened beta to 50 pilot users for lead intelligence module.', priority: 'Critical', assignee: 'E. Vasquez', createdAt: 'Jun 20' },
    { id: 7, title: 'Legal review of ToS v2', description: 'Updated terms approved by counsel and published.', priority: 'High', assignee: 'M. Webb', createdAt: 'Jun 22' },
  ],
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
      className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider"
      style={{ background: s.bg, color: s.color }}
    >
      {priority}
    </span>
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
      style={{
        background: '#0f2035',
        border: '1px solid rgba(201,168,76,0.13)',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold leading-snug text-balance" style={{ color: '#f0f4f8' }}>
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
              className="p-1 rounded-md transition-colors"
              style={{ color: '#7a95b0', background: 'rgba(122,149,176,0.1)' }}
              title="Move back"
            >
              <ChevronLeft size={13} />
            </button>
          )}
          {canForward && (
            <button
              onClick={() => onMove(task, col, 'forward')}
              className="p-1 rounded-md transition-colors"
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

// ── Column ─────────────────────────────────────────────────────────────────

const COL_META: Record<Status, { label: string; accent: string; dot: string }> = {
  backlog:      { label: 'Backlog',     accent: 'rgba(122,149,176,0.15)', dot: '#7a95b0' },
  'in-progress':{ label: 'In Progress', accent: 'rgba(201,168,76,0.12)',  dot: '#c9a84c' },
  completed:    { label: 'Completed',   accent: 'rgba(74,156,93,0.12)',   dot: '#4a9c5d' },
}

function Column({
  col,
  tasks,
  onMove,
}: {
  col: Status
  tasks: Task[]
  onMove: (task: Task, from: Status, dir: 'forward' | 'back') => void
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
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} col={col} onMove={onMove} />
        ))}
        {tasks.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-10 rounded-xl"
            style={{ border: '1px dashed rgba(201,168,76,0.1)' }}
          >
            <AlignLeft size={20} style={{ color: 'rgba(201,168,76,0.25)' }} />
            <p className="mt-2 text-xs font-mono" style={{ color: 'rgba(122,149,176,0.5)' }}>
              No tasks
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Create task modal ──────────────────────────────────────────────────────

const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low']
let nextId = 100

function CreateModal({ onClose, onCreate }: { onClose: () => void; onCreate: (t: Task) => void }) {
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
        {/* Header */}
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

        {/* Form */}
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
                  <option key={p} value={p} style={{ background: '#0f2035' }}>
                    {p}
                  </option>
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

        {/* Actions */}
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
  const [board, setBoard] = useState<Board>(INITIAL_BOARD)
  const [modalOpen, setModalOpen] = useState(false)

  function moveTask(task: Task, from: Status, dir: 'forward' | 'back') {
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
    setBoard((prev) => ({ ...prev, backlog: [task, ...prev.backlog] }))
  }

  const total = COLS.reduce((sum, col) => sum + board[col].length, 0)

  return (
    <>
      {modalOpen && (
        <CreateModal onClose={() => setModalOpen(false)} onCreate={addTask} />
      )}

      <div className="p-6">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <KanbanSquare size={16} style={{ color: '#c9a84c' }} />
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#7a95b0' }}>
                COO · Operations Board
              </span>
            </div>
            <h1 className="text-xl font-semibold text-balance" style={{ color: '#f0f4f8' }}>
              Task Management
            </h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: '#7a95b0' }}>
              {total} active tasks across {COLS.length} stages
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{ background: '#c9a84c', color: '#0b1929' }}
          >
            <Plus size={15} />
            Create Task
          </button>
        </div>

        {/* Kanban board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLS.map((col) => (
            <Column key={col} col={col} tasks={board[col]} onMove={moveTask} />
          ))}
        </div>
      </div>
    </>
  )
}
