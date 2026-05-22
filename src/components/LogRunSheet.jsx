import React, { useState, useEffect } from 'react'
import { RUN_TYPES } from '../data/plan.js'
import { Input, Textarea, Btn, EffortDots } from './UI.jsx'

export default function LogRunSheet({ weekNum, runType, plannedKm, existingLog, onSave, onDelete, onClose }) {
  const rt = RUN_TYPES[runType]

  const [distance, setDistance] = useState(existingLog?.distance || '')
  const [minutes, setMinutes] = useState(existingLog?.minutes || '')
  const [effort, setEffort] = useState(existingLog?.effort || 3)
  const [notes, setNotes] = useState(existingLog?.notes || '')
  const [date, setDate] = useState(existingLog?.runDate || new Date().toISOString().split('T')[0])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleSave() {
    if (!distance) return
    onSave({ distance: parseFloat(distance), minutes: parseInt(minutes) || null, effort, notes, runDate: date })
  }

  const paceStr = (() => {
    if (!distance || !minutes || parseFloat(distance) === 0) return null
    const pace = parseFloat(minutes) / parseFloat(distance)
    const mins = Math.floor(pace)
    const secs = Math.round((pace - mins) * 60).toString().padStart(2, '0')
    return `${mins}:${secs} /km`
  })()

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-up"
        style={{
          width: '100%', maxWidth: 480,
          background: 'var(--bg-1)',
          borderTop: '1px solid var(--border)',
          borderRadius: '16px 16px 0 0',
          padding: '24px 20px 40px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-0)', marginBottom: 2 }}>
              {rt.label}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
              Week {weekNum} · Planned {plannedKm} km
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'var(--bg-3)', border: 'none', color: 'var(--text-3)', width: 28, height: 28, borderRadius: '50%', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        {/* Tip */}
        <div style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: 13,
          color: 'var(--text-3)',
          marginBottom: 24,
          lineHeight: 1.5,
        }}>
          {rt.tip}
        </div>

        <Input label="Distance" value={distance} onChange={setDistance} type="number" placeholder={plannedKm.toString()} unit="km" />
        <Input label="Duration" value={minutes} onChange={setMinutes} type="number" placeholder="45" unit="min" />

        {paceStr && (
          <div style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 16, marginTop: -10 }}>
            {paceStr} avg pace
          </div>
        )}

        <Input label="Date" value={date} onChange={setDate} type="date" />

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, display: 'block', marginBottom: 8 }}>
            Effort (1–5)
          </label>
          <EffortDots value={effort} onChange={setEffort} />
          <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 6 }}>
            {['', 'Very easy', 'Easy', 'Moderate', 'Hard', 'Max effort'][effort]}
          </div>
        </div>

        <Textarea label="Notes" value={notes} onChange={setNotes} placeholder="How did it feel?" rows={2} />

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <Btn onClick={handleSave} disabled={!distance} style={{ flex: 1 }}>
            {existingLog ? 'Update' : 'Save Run'}
          </Btn>
          {existingLog && (
            <Btn variant="danger" onClick={() => { onDelete(); onClose() }}>Delete</Btn>
          )}
        </div>
      </div>
    </div>
  )
}
