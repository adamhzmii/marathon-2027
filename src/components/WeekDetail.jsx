import React, { useState } from 'react'
import { getPhaseObj, RUN_TYPES } from '../data/plan.js'
import { Badge, Btn } from './UI.jsx'
import LogRunSheet from './LogRunSheet.jsx'

function RunRow({ weekNum, runType, plannedKm, log, onLogRun, onDeleteLog }) {
  const [showSheet, setShowSheet] = useState(false)
  const rt = RUN_TYPES[runType]
  const done = !!log

  return (
    <>
      <div
        onClick={() => setShowSheet(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 16px',
          background: done ? 'var(--bg-2)' : 'var(--bg-1)',
          border: `1px solid ${done ? 'var(--border)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius)',
          marginBottom: 8,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {/* Dot indicator */}
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: done ? rt.color : 'var(--text-4)',
          flexShrink: 0,
          transition: 'background 0.2s',
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--text-0)', fontWeight: 500 }}>{rt.label}</span>
            <span style={{ fontSize: 12, color: 'var(--text-4)' }}>{plannedKm} km</span>
          </div>
          {done && (
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 3 }}>
              {log.distance} km{log.minutes ? ` · ${log.minutes} min` : ''}{log.effort ? ` · RPE ${log.effort}` : ''}
            </div>
          )}
        </div>

        <div style={{
          fontSize: 12, fontWeight: 500,
          color: done ? 'var(--text-3)' : 'var(--text-4)',
        }}>
          {done ? 'Edit' : 'Log'}
        </div>
      </div>

      {showSheet && (
        <LogRunSheet
          weekNum={weekNum} runType={runType} plannedKm={plannedKm} existingLog={log}
          onSave={(data) => { onLogRun(weekNum, runType, data); setShowSheet(false) }}
          onDelete={() => onDeleteLog(weekNum, runType)}
          onClose={() => setShowSheet(false)}
        />
      )}
    </>
  )
}

export default function WeekDetail({ week, weekLogs, onLogRun, onDeleteLog, onBack }) {
  const phase = getPhaseObj(week.phase)
  const completedCount = [weekLogs.easy, weekLogs.mid, weekLogs.long].filter(Boolean).length
  const loggedKm = [weekLogs.easy, weekLogs.mid, weekLogs.long]
    .reduce((s, l) => s + (l ? parseFloat(l.distance) || 0 : 0), 0)

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg-0)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onBack} style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            color: 'var(--text-2)', width: 32, height: 32,
            borderRadius: 'var(--radius-xs)', fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            ←
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-0)' }}>Week {week.week}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{week.dateRange}</div>
          </div>
          <Badge color={phase.color}>{phase.name}</Badge>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Progress bar */}
        <div style={{
          background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius)', padding: '16px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{completedCount}/3 runs completed</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>
              {Math.round((completedCount / 3) * 100)}%
            </span>
          </div>
          <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              width: `${(completedCount / 3) * 100}%`,
              background: phase.color,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Notes */}
        {week.notes && (
          <div style={{
            background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px', marginBottom: 20,
            fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6,
          }}>
            {week.notes}
          </div>
        )}

        {/* Runs */}
        <div style={{ marginBottom: 20 }}>
          <RunRow weekNum={week.week} runType="easy" plannedKm={week.easyRun} log={weekLogs.easy} onLogRun={onLogRun} onDeleteLog={onDeleteLog} />
          <RunRow weekNum={week.week} runType="mid" plannedKm={week.midRun} log={weekLogs.mid} onLogRun={onLogRun} onDeleteLog={onDeleteLog} />
          <RunRow weekNum={week.week} runType="long" plannedKm={week.longRun} log={weekLogs.long} onLogRun={onLogRun} onDeleteLog={onDeleteLog} />
        </div>

        {/* Totals row */}
        <div style={{
          display: 'flex', gap: 12,
        }}>
          {[
            { label: 'Planned', value: `${week.totalKm} km`, color: 'var(--text-2)' },
            { label: 'Logged', value: `${loggedKm.toFixed(1)} km`, color: phase.color },
            { label: 'Diff', value: `${loggedKm > 0 ? (loggedKm >= week.totalKm ? '+' : '') : ''}${loggedKm > 0 ? (loggedKm - week.totalKm).toFixed(1) : '—'} km`, color: loggedKm >= week.totalKm ? 'var(--green)' : 'var(--text-4)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              flex: 1, background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', padding: '12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
