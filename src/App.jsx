import React, { useState } from 'react'
import PlanScreen from './components/PlanScreen.jsx'
import StatsScreen from './components/StatsScreen.jsx'
import GuideScreen from './components/GuideScreen.jsx'
import { useRunLogs } from './hooks/useRunLogs.js'

const CalendarIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fafafa' : '#52525b'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ChartIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fafafa' : '#52525b'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const BookIcon = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fafafa' : '#52525b'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
)

const NAV = [
  { id: 'plan', label: 'Plan', Icon: CalendarIcon },
  { id: 'stats', label: 'Stats', Icon: ChartIcon },
  { id: 'guide', label: 'Guide', Icon: BookIcon },
]

export default function App() {
  const [tab, setTab] = useState('plan')
  const { logs, logRun, deleteLog, getWeekLogs, getCompletedWeeks, getTotalKmLogged, getWeekCompletion, exportData } = useRunLogs()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        {tab === 'plan' && (
          <PlanScreen getWeekLogs={getWeekLogs} getWeekCompletion={getWeekCompletion} logRun={logRun} deleteLog={deleteLog} />
        )}
        {tab === 'stats' && (
          <StatsScreen logs={logs} getWeekLogs={getWeekLogs} getTotalKmLogged={getTotalKmLogged} getCompletedWeeks={getCompletedWeeks} />
        )}
        {tab === 'guide' && <GuideScreen exportData={exportData} />}
      </div>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        maxWidth: 480, margin: '0 auto',
        background: 'rgba(10,10,11,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, background: 'none', border: 'none',
              padding: '10px 0 8px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, cursor: 'pointer',
              transition: 'opacity 0.15s', opacity: active ? 1 : 0.6,
              position: 'relative',
            }}>
              {active && <div style={{
                position: 'absolute', top: -1, width: 16, height: 2,
                background: 'var(--text-0)', borderRadius: '0 0 1px 1px',
              }} />}
              <Icon active={active} />
              <span style={{
                fontSize: 10, fontWeight: 500, letterSpacing: 0.3,
                color: active ? 'var(--text-0)' : 'var(--text-4)',
              }}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
