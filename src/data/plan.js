export const RACE_DATE = new Date('2027-04-18')
export const START_DATE = new Date('2026-06-01')
export const TOTAL_WEEKS = 46

export const PHASES = [
  {
    id: 'base',
    name: 'Base',
    range: [1, 16],
    color: '#34d399',
    desc: 'Build your aerobic engine. Every run at easy, conversational pace. Protect joints, build the habit.',
    weeks: 16,
  },
  {
    id: 'build',
    name: 'Build',
    range: [17, 30],
    color: '#fbbf24',
    desc: 'Introduce tempo efforts and longer long runs. Mileage climbs steadily week on week.',
    weeks: 14,
  },
  {
    id: 'peak',
    name: 'Peak',
    range: [31, 42],
    color: '#e68a3c',
    desc: 'Your hardest training block. Long runs hit 33–34km with race-pace finishes.',
    weeks: 12,
  },
  {
    id: 'taper',
    name: 'Taper',
    range: [43, 46],
    color: '#a78bfa',
    desc: 'Volume drops sharply. Keep some intensity. Trust the training. Arrive fresh.',
    weeks: 4,
  },
]

export const RUN_TYPES = {
  easy: {
    key: 'easy',
    label: 'Easy Run',
    shortLabel: 'Easy',
    dot: '●',
    color: '#34d399',
    tip: 'Fully conversational — you should be able to hold a complete sentence without gasping.',
  },
  mid: {
    key: 'mid',
    label: 'Quality Run',
    shortLabel: 'Quality',
    dot: '●',
    color: '#fbbf24',
    tip: 'Comfortably hard. Can speak a few words. Includes tempo or intervals from Build phase onwards.',
  },
  long: {
    key: 'long',
    label: 'Long Run',
    shortLabel: 'Long',
    dot: '●',
    color: '#e68a3c',
    tip: 'Easy pace throughout. The cornerstone of marathon training. Never race these.',
  },
}

function getPhase(w) {
  if (w <= 16) return 'base'
  if (w <= 30) return 'build'
  if (w <= 42) return 'peak'
  return 'taper'
}

export function generateWeeks() {
  const weeks = []
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    const phase = getPhase(w)
    const isRecovery = w % 4 === 0

    let longRun, midRun, easyRun, notes, qualityFocus

    if (phase === 'base') {
      longRun = Math.min(6 + (w - 1) * 0.75, 18)
      if (isRecovery) longRun = Math.round(longRun * 0.8)
      midRun = Math.round(longRun * 0.55)
      easyRun = Math.round(longRun * 0.45)
      notes = isRecovery ? 'Recovery week — volume reduced 20%. Focus on form.' : 'All runs at easy, conversational pace.'
      qualityFocus = 'Easy pace'
    } else if (phase === 'build') {
      const bw = w - 16
      longRun = Math.min(18 + bw * 0.85, 28)
      if (isRecovery) longRun = Math.round(longRun * 0.8)
      midRun = Math.round(longRun * 0.6)
      easyRun = Math.round(longRun * 0.5)
      qualityFocus = bw <= 7 ? '20 min tempo effort' : '2×10 min threshold intervals'
      notes = isRecovery ? 'Recovery week — lighter load.' : `Quality run: ${qualityFocus}`
    } else if (phase === 'peak') {
      const pw = w - 30
      longRun = pw <= 6 ? Math.min(28 + pw * 1.0, 34) : 34 - (pw - 6) * 0.5
      if (isRecovery) longRun = Math.round(longRun * 0.8)
      midRun = Math.round(longRun * 0.65)
      easyRun = Math.round(longRun * 0.5)
      qualityFocus = pw <= 6 ? 'Marathon-pace intervals' : 'Race simulation'
      notes = isRecovery ? 'Recovery week — maintain sharpness.' : `Long run: last 5km at marathon effort. ${qualityFocus}`
    } else {
      const tw = w - 42
      const factors = [0.75, 0.6, 0.45, 0.3]
      longRun = Math.round(32 * factors[tw - 1])
      midRun = Math.round(longRun * 0.6)
      easyRun = Math.round(longRun * 0.4)
      qualityFocus = tw === 4 ? 'Shakeout only' : 'Race pace strides'
      notes = tw === 4 ? 'Race week. Short shakeouts only. Rest, eat, hydrate.' : 'Trust the process. Legs should feel fresh.'
    }

    longRun = Math.round(longRun * 10) / 10
    midRun = Math.max(midRun, 4)
    easyRun = Math.max(easyRun, 3)
    const totalKm = Math.round((longRun + midRun + easyRun) * 10) / 10

    const weekStart = new Date(START_DATE)
    weekStart.setDate(START_DATE.getDate() + (w - 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

    weeks.push({
      week: w, phase, isRecovery, longRun, midRun, easyRun, totalKm, notes, qualityFocus,
      dateRange: `${fmt(weekStart)} – ${fmt(weekEnd)}`,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
    })
  }
  return weeks
}

export const ALL_WEEKS = generateWeeks()
export function getPhaseObj(id) { return PHASES.find(p => p.id === id) }
export function getCurrentWeek() {
  const today = new Date()
  if (today < START_DATE) return 1
  return Math.min(Math.max(Math.floor((today - START_DATE) / (7*24*60*60*1000)) + 1, 1), TOTAL_WEEKS)
}
export function getWeeksUntilRace() { return Math.max(Math.ceil((RACE_DATE - new Date()) / (7*24*60*60*1000)), 0) }
export function getDaysUntilRace() { const t = new Date(); t.setHours(0,0,0,0); return Math.max(Math.ceil((RACE_DATE - t) / (24*60*60*1000)), 0) }
