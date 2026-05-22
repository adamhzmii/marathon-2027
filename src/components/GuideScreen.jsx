import React, { useState } from 'react'
import { PHASES, RUN_TYPES } from '../data/plan.js'
import { SectionLabel } from './UI.jsx'

const TIPS = [
  { title: '10% Rule', body: 'Never increase weekly mileage by more than 10%. This is the most important injury prevention rule.' },
  { title: 'Recovery is training', body: 'Sleep and rest days are when your body adapts. Skipping recovery makes you injured, not fitter.' },
  { title: 'Hydration', body: 'Drink water before, during (runs over 45 min), and after. Dehydration tanks performance.' },
  { title: 'Get proper shoes', body: 'Visit a specialist running shop in Manchester for a gait analysis before serious mileage starts.' },
  { title: 'Gym balance', body: 'Your PPL split complements running well. Just avoid heavy leg sessions before your long run or quality run.' },
  { title: 'Fuelling', body: 'For runs over 75 min, practise gels, chews, or dates. Never try anything new on race day.' },
  { title: 'Recovery weeks', body: 'Every 4th week is ~20% lower volume. These are where fitness solidifies. Not optional.' },
  { title: 'Easy = slow', body: 'Easy runs should feel embarrassingly slow. If you can\'t hold a full conversation, slow down.' },
]

export default function GuideScreen({ exportData }) {
  const [openTip, setOpenTip] = useState(null)

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ padding: '32px 20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-4)', marginBottom: 4 }}>adam's handbook</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-0)', letterSpacing: -0.3 }}>Guide</div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Phases */}
        <SectionLabel>Training phases</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {PHASES.map(p => (
            <div key={p.id} style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius)', padding: '16px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
                background: p.color,
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, paddingLeft: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-0)' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-4)' }}>Weeks {p.range[0]}–{p.range[1]}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, paddingLeft: 4 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Run types */}
        <SectionLabel>Run types</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {Object.values(RUN_TYPES).map(rt => (
            <div key={rt.key} style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius)', padding: '14px 16px',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', background: rt.color,
                flexShrink: 0, marginTop: 5,
              }} />
              <div>
                <div style={{ fontSize: 14, color: 'var(--text-0)', fontWeight: 500, marginBottom: 4 }}>{rt.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>{rt.tip}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips accordion */}
        <SectionLabel>Tips & principles</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {TIPS.map((tip, i) => (
            <div
              key={i}
              onClick={() => setOpenTip(openTip === i ? null : i)}
              style={{
                background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)', padding: '14px 16px',
                cursor: 'pointer', transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{tip.title}</span>
                <span style={{
                  fontSize: 12, color: 'var(--text-4)',
                  transform: openTip === i ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>
                  ▾
                </span>
              </div>
              {openTip === i && (
                <div className="fade-in" style={{
                  fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6,
                  marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)',
                }}>
                  {tip.body}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Export */}
        <div style={{
          background: 'var(--bg-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius)', padding: '16px',
        }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>
            Export your run data as a JSON file for backup.
          </div>
          <button
            onClick={exportData}
            style={{
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xs)', padding: '8px 16px',
              fontSize: 13, color: 'var(--text-2)', fontWeight: 500, cursor: 'pointer',
            }}
          >
            Export data →
          </button>
        </div>

        <div style={{ height: 80 }} />
      </div>
    </div>
  )
}
