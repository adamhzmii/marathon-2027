import React from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { ALL_WEEKS, getPhaseObj, getCurrentWeek } from '../data/plan.js'
import { SectionLabel } from './UI.jsx'

export default function StatsScreen({ logs, getWeekLogs, getTotalKmLogged, getCompletedWeeks }) {
  const currentWeek = getCurrentWeek()
  const completedWeeks = getCompletedWeeks()
  const totalLogged = getTotalKmLogged()
  const allLogs = Object.entries(logs)

  let streak = 0
  for (let w = currentWeek; w >= 1; w--) {
    if (completedWeeks.has(w)) streak++
    else break
  }

  const chartData = ALL_WEEKS.slice(Math.max(0, currentWeek - 12), currentWeek).map(w => {
    const wl = getWeekLogs(w.week)
    const logged = [wl.easy, wl.mid, wl.long].reduce((s, l) => s + (l ? parseFloat(l.distance) || 0 : 0), 0)
    return { week: `W${w.week}`, planned: w.totalKm, logged: logged > 0 ? Math.round(logged * 10) / 10 : null }
  })

  const phaseStats = ['base', 'build', 'peak', 'taper'].map(phaseId => {
    const phaseWeeks = ALL_WEEKS.filter(w => w.phase === phaseId)
    const done = phaseWeeks.filter(w => completedWeeks.has(w.week)).length
    return { ...getPhaseObj(phaseId), done, total: phaseWeeks.length }
  })

  const longestRun = allLogs.reduce((best, [, log]) => {
    const d = parseFloat(log.distance) || 0
    return d > (best?.distance || 0) ? log : best
  }, null)

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ padding: '32px 20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-4)', marginBottom: 4 }}>adam's progress</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-0)', letterSpacing: -0.3 }}>Stats</div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Big numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
          {[
            { label: 'Total logged', val: `${Math.round(totalLogged)}`, unit: 'km', color: 'var(--text-0)' },
            { label: 'Week streak', val: streak, unit: 'w', color: 'var(--accent)' },
            { label: 'Runs logged', val: allLogs.length, unit: '', color: 'var(--text-0)' },
            { label: 'Weeks active', val: completedWeeks.size, unit: `/ ${currentWeek}`, color: 'var(--text-0)' },
          ].map(({ label, val, unit, color }) => (
            <div key={label} style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius)', padding: '16px',
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 8, fontWeight: 500 }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: -0.5 }}>{val}</span>
                {unit && <span style={{ fontSize: 13, color: 'var(--text-4)', fontWeight: 500 }}>{unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div style={{
            background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius)', padding: '16px', marginBottom: 24,
          }}>
            <SectionLabel>Weekly volume</SectionLabel>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#27272a" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#27272a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gLogged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e68a3c" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#e68a3c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
                  labelStyle={{ color: '#a1a1aa' }}
                  itemStyle={{ color: '#d4d4d8' }}
                />
                <Area type="monotone" dataKey="planned" stroke="#3f3f46" fill="url(#gPlanned)" strokeWidth={1} name="Planned" dot={false} />
                <Area type="monotone" dataKey="logged" stroke="#e68a3c" fill="url(#gLogged)" strokeWidth={2} name="Logged" dot={{ r: 2.5, fill: '#e68a3c' }} connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Phase completion */}
        <SectionLabel>Phase completion</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {phaseStats.map(p => (
            <div key={p.id} style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500, marginBottom: 8 }}>{p.name}</div>
                <div style={{ height: 3, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${p.total > 0 ? Math.round((p.done / p.total) * 100) : 0}%`,
                    background: p.color, transition: 'width 0.6s',
                  }} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: p.color, fontWeight: 600, flexShrink: 0 }}>
                {p.done}/{p.total}
              </div>
            </div>
          ))}
        </div>

        {/* Longest run */}
        {longestRun && longestRun.distance && (
          <>
            <SectionLabel>Longest run</SectionLabel>
            <div style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius)', padding: '16px', marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-0)', letterSpacing: -1 }}>
                  {longestRun.distance}
                </span>
                <span style={{ fontSize: 14, color: 'var(--text-4)', fontWeight: 500 }}>km</span>
              </div>
              {longestRun.minutes && (
                <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
                  {longestRun.minutes} min · {(() => {
                    const p = longestRun.minutes / longestRun.distance
                    return `${Math.floor(p)}:${Math.round((p % 1) * 60).toString().padStart(2, '0')} /km`
                  })()}
                </div>
              )}
            </div>
          </>
        )}

        {allLogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-4)', fontSize: 14, lineHeight: 1.8 }}>
            No runs logged yet.<br />
            <span style={{ color: 'var(--text-3)' }}>Head to Plan and start logging.</span>
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}
