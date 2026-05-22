import React, { useState, useRef, useEffect } from 'react'
import { ALL_WEEKS, PHASES, getPhaseObj, getCurrentWeek, getWeeksUntilRace, getDaysUntilRace } from '../data/plan.js'
import { ProgressRing, Badge } from './UI.jsx'
import WeekDetail from './WeekDetail.jsx'

function WeekCard({ w, isCurrentWeek, completion, onClick }) {
  const phase = getPhaseObj(w.phase)
  const { done } = completion

  return (
    <div
      onClick={onClick}
      style={{
        background: isCurrentWeek ? 'var(--bg-2)' : 'var(--bg-1)',
        border: `1px solid ${isCurrentWeek ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius)',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          {isCurrentWeek && (
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'var(--accent)',
              marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                animation: 'pulse 2s infinite', display: 'inline-block',
              }} />
              This week
            </div>
          )}
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-0)' }}>Week {w.week}</div>
          <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>{w.dateRange}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <Badge color={phase.color}>{phase.name}</Badge>
          {done > 0 && (
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: i < done ? phase.color : 'var(--bg-3)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { label: 'Easy', km: w.easyRun, color: '#34d399' },
          { label: 'Quality', km: w.midRun, color: '#fbbf24' },
          { label: 'Long', km: w.longRun, color: '#e68a3c' },
        ].map(({ label, km, color }) => (
          <div key={label} style={{
            flex: 1, background: 'var(--bg-0)', borderRadius: 'var(--radius-xs)',
            padding: '10px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 4, fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-0)' }}>{km}</div>
            <div style={{ fontSize: 10, color: 'var(--text-4)' }}>km</div>
          </div>
        ))}
        <div style={{
          flex: 1, background: 'var(--bg-0)', borderRadius: 'var(--radius-xs)',
          padding: '10px 8px', textAlign: 'center',
          borderLeft: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 4, fontWeight: 500 }}>Total</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: phase.color }}>{w.totalKm}</div>
          <div style={{ fontSize: 10, color: 'var(--text-4)' }}>km</div>
        </div>
      </div>

      {w.isRecovery && (
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-4)' }}>
          ↓ Recovery week
        </div>
      )}
    </div>
  )
}

export default function PlanScreen({ getWeekLogs, getWeekCompletion, logRun, deleteLog }) {
  const [activePhase, setActivePhase] = useState('all')
  const [selectedWeek, setSelectedWeek] = useState(null)
  const currentWeek = getCurrentWeek()
  const weeksLeft = getWeeksUntilRace()
  const daysLeft = getDaysUntilRace()
  const currentRef = useRef(null)

  if (selectedWeek) {
    return (
      <WeekDetail
        week={selectedWeek}
        weekLogs={getWeekLogs(selectedWeek.week)}
        onLogRun={logRun}
        onDeleteLog={deleteLog}
        onBack={() => setSelectedWeek(null)}
      />
    )
  }

  const filtered = activePhase === 'all' ? ALL_WEEKS : ALL_WEEKS.filter(w => w.phase === activePhase)
  const curPhase = getPhaseObj(ALL_WEEKS[currentWeek - 1]?.phase || 'base')
  const weeksPct = Math.round(((currentWeek - 1) / 46) * 100)

  return (
    <div>
      {/* Hero */}
      <div style={{
        padding: '32px 20px 24px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {/* Personal brand */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-4)', marginBottom: 4 }}>
            adam's training
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-0)', lineHeight: 1.15, letterSpacing: -0.5 }}>
            Manchester<br />Marathon 2027
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 1, background: 'var(--border-subtle)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {[
            { val: daysLeft, label: 'days', color: 'var(--text-0)' },
            { val: weeksLeft, label: 'weeks', color: 'var(--text-0)' },
            { val: `W${currentWeek}`, label: 'current', color: 'var(--accent)' },
            { val: `${weeksPct}%`, label: 'progress', color: curPhase.color },
          ].map(({ val, label, color }) => (
            <div key={label} style={{
              flex: 1, background: 'var(--bg-1)', padding: '14px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 4, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase filter */}
      <div style={{
        padding: '12px 20px',
        display: 'flex', gap: 6, overflowX: 'auto',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {[['all', 'All'], ...PHASES.map(p => [p.id, p.name])].map(([id, label]) => {
          const active = activePhase === id
          return (
            <button key={id} onClick={() => setActivePhase(id)} style={{
              background: active ? 'var(--text-0)' : 'transparent',
              border: `1px solid ${active ? 'var(--text-0)' : 'var(--border)'}`,
              borderRadius: 20, padding: '6px 14px',
              fontSize: 12, fontWeight: 500,
              color: active ? 'var(--bg-0)' : 'var(--text-3)',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'all 0.15s',
            }}>
              {label}
            </button>
          )
        })}
      </div>

      {/* Week list */}
      <div style={{ padding: '16px 20px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(w => (
          <WeekCard
            key={w.week} w={w}
            isCurrentWeek={w.week === currentWeek}
            completion={getWeekCompletion(w.week)}
            onClick={() => setSelectedWeek(w)}
          />
        ))}
      </div>
    </div>
  )
}
