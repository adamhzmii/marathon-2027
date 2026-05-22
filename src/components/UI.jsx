import React from 'react'

export function ProgressRing({ pct, color = 'var(--accent)', size = 80, stroke = 4 }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (Math.min(pct, 100) / 100)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1)' }}
      />
    </svg>
  )
}

export function Badge({ children, color = 'var(--text-3)', style = {} }) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 500,
      color,
      padding: '4px 10px',
      borderRadius: 20,
      background: 'var(--bg-3)',
      border: '1px solid var(--border)',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  )
}

export function Card({ children, style = {}, onClick, active = false }) {
  return (
    <div onClick={onClick} style={{
      background: active ? 'var(--bg-2)' : 'var(--bg-1)',
      border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius)',
      padding: '16px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function SectionLabel({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--text-3)',
      marginBottom: 10,
      letterSpacing: 0.2,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function EffortDots({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            width: 32, height: 32,
            borderRadius: '50%',
            border: `1.5px solid ${n <= value ? 'var(--accent)' : 'var(--border)'}`,
            background: n <= value ? 'var(--accent-subtle)' : 'transparent',
            color: n <= value ? 'var(--accent)' : 'var(--text-4)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

export function Input({ label, value, onChange, type = 'text', placeholder, unit, style = {} }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <label style={{
          fontSize: 12, color: 'var(--text-3)', fontWeight: 500,
          display: 'block', marginBottom: 6,
        }}>
          {label}
        </label>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-0)',
            padding: '10px 14px',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--text-4)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        {unit && <span style={{ fontSize: 13, color: 'var(--text-3)', flexShrink: 0, fontWeight: 500 }}>{unit}</span>}
      </div>
    </div>
  )
}

export function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, display: 'block', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-0)',
          padding: '10px 14px',
          fontSize: 14,
          outline: 'none',
          resize: 'vertical',
          lineHeight: 1.5,
        }}
        onFocus={e => e.target.style.borderColor = 'var(--text-4)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}

export function Btn({ children, onClick, variant = 'primary', style = {}, disabled = false }) {
  const styles = {
    primary: { background: 'var(--text-0)', color: 'var(--bg-0)', border: 'none', fontWeight: 600 },
    secondary: { background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)', fontWeight: 500 },
    danger: { background: 'transparent', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.2)', fontWeight: 500 },
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'opacity 0.15s',
        ...styles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}
