import { useState, useEffect, useCallback } from 'react'
import { getCurrentWeek } from '../data/plan.js'

const STORAGE_KEY = 'marathon_run_logs'

export function useRunLogs() {
  const [logs, setLogs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
    } catch (e) {
      console.warn('Could not save to localStorage', e)
    }
  }, [logs])

  // logs structure: { "week_1_easy": { distance, time, effort, notes, date, completed } }
  const logRun = useCallback((weekNum, runType, data) => {
    const key = `week_${weekNum}_${runType}`
    setLogs(prev => ({
      ...prev,
      [key]: { ...data, date: data.date || new Date().toISOString(), completed: true }
    }))
  }, [])

  const deleteLog = useCallback((weekNum, runType) => {
    const key = `week_${weekNum}_${runType}`
    setLogs(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const getLog = useCallback((weekNum, runType) => {
    return logs[`week_${weekNum}_${runType}`] || null
  }, [logs])

  const getWeekLogs = useCallback((weekNum) => {
    return {
      easy: logs[`week_${weekNum}_easy`] || null,
      mid: logs[`week_${weekNum}_mid`] || null,
      long: logs[`week_${weekNum}_long`] || null,
    }
  }, [logs])

  const getCompletedWeeks = useCallback(() => {
    const completed = new Set()
    Object.keys(logs).forEach(key => {
      const match = key.match(/^week_(\d+)_/)
      if (match) completed.add(parseInt(match[1]))
    })
    return completed
  }, [logs])

  const getTotalKmLogged = useCallback(() => {
    return Object.values(logs).reduce((sum, log) => sum + (parseFloat(log.distance) || 0), 0)
  }, [logs])

  const getStreak = useCallback(() => {
    const completed = getCompletedWeeks()
    let streak = 0
    const cur = getCurrentWeek()
    for (let w = cur; w >= 1; w--) {
      if (completed.has(w)) streak++
      else break
    }
    return streak
  }, [getCompletedWeeks])

  const getWeekCompletion = useCallback((weekNum) => {
    const wLogs = getWeekLogs(weekNum)
    const done = [wLogs.easy, wLogs.mid, wLogs.long].filter(Boolean).length
    return { done, total: 3, pct: Math.round((done / 3) * 100) }
  }, [getWeekLogs])

  const exportData = useCallback(() => {
    const data = JSON.stringify(logs, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'marathon-runs-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [logs])

  return { logs, logRun, deleteLog, getLog, getWeekLogs, getCompletedWeeks, getTotalKmLogged, getWeekCompletion, exportData }
}
