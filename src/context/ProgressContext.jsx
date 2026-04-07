import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ProgressContext = createContext(null)

const DEFAULT_PROGRESS = {
  streak: 0,
  lastPlayedDate: null,
  totalSessionsPlayed: 0,
  badges: [],
  games: {
    memory:   { sessions: [], bestScore: 0, timesPlayed: 0 },
    stroop:   { sessions: [], bestScore: 0, timesPlayed: 0 },
    sequence: { sessions: [], bestScore: 0, timesPlayed: 0 },
    pattern:  { sessions: [], bestScore: 0, timesPlayed: 0 },
  },
}

function loadLocal() {
  try {
    const saved = localStorage.getItem('brainboost_progress')
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS
  } catch {
    return DEFAULT_PROGRESS
  }
}

function saveLocal(p) {
  localStorage.setItem('brainboost_progress', JSON.stringify(p))
}

/** Rebuild a progress object from raw Supabase rows */
function buildProgressFromRows(sessions, badges) {
  const progress = structuredClone(DEFAULT_PROGRESS)

  const sorted = [...sessions].sort((a, b) => new Date(a.played_at) - new Date(b.played_at))

  for (const row of sorted) {
    const g = progress.games[row.game_id]
    if (!g) continue
    g.sessions.push({ score: row.score, accuracy: row.accuracy, date: row.played_at })
    g.bestScore = Math.max(g.bestScore, row.score)
    g.timesPlayed += 1
    progress.totalSessionsPlayed += 1
  }

  // Rebuild streak from dates
  const uniqueDays = [...new Set(sorted.map(r => new Date(r.played_at).toDateString()))].reverse()
  if (uniqueDays.length > 0) {
    progress.lastPlayedDate = new Date(sorted[sorted.length - 1].played_at).toDateString()
    let streak = 1
    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const d1 = new Date(uniqueDays[i])
      const d2 = new Date(uniqueDays[i + 1])
      const diff = Math.round((d1 - d2) / 86400000)
      if (diff === 1) streak++
      else break
    }
    progress.streak = streak
  }

  progress.badges = badges.map(b => b.badge_id)
  return progress
}

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const [progress, setProgress] = useState(loadLocal)
  const [syncing, setSyncing]   = useState(false)

  // When user signs in, load their cloud data
  useEffect(() => {
    if (user) {
      loadFromSupabase(user.id)
    } else if (user === null) {
      // Signed out — fall back to local
      setProgress(loadLocal())
    }
  }, [user])

  // Keep localStorage in sync when offline / not signed in
  useEffect(() => {
    if (!user) saveLocal(progress)
  }, [progress, user])

  const loadFromSupabase = useCallback(async (userId) => {
    setSyncing(true)
    const [{ data: sessions }, { data: badges }] = await Promise.all([
      supabase.from('game_sessions').select('*').eq('user_id', userId).order('played_at'),
      supabase.from('user_badges').select('*').eq('user_id', userId),
    ])
    const built = buildProgressFromRows(sessions || [], badges || [])
    setProgress(built)
    setSyncing(false)
  }, [])

  async function recordSession(gameId, score, accuracy) {
    const today = new Date().toDateString()

    setProgress(prev => {
      const lastDate = prev.lastPlayedDate
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      let newStreak = prev.streak
      if (lastDate !== today) {
        newStreak = lastDate === yesterday.toDateString() ? prev.streak + 1 : 1
      }

      const gameData = prev.games[gameId]
      const newSession = { score, accuracy, date: new Date().toISOString() }
      const updatedSessions = [...(gameData.sessions || []).slice(-29), newSession]

      const newBadges = [...prev.badges]
      const totalPlayed = prev.totalSessionsPlayed + 1
      if (totalPlayed === 1  && !newBadges.includes('first_session')) newBadges.push('first_session')
      if (totalPlayed === 10 && !newBadges.includes('ten_sessions'))  newBadges.push('ten_sessions')
      if (newStreak >= 3     && !newBadges.includes('streak_3'))      newBadges.push('streak_3')
      if (newStreak >= 7     && !newBadges.includes('streak_7'))      newBadges.push('streak_7')
      if (score >= 100       && !newBadges.includes('perfect_100'))   newBadges.push('perfect_100')

      return {
        ...prev,
        streak: newStreak,
        lastPlayedDate: today,
        totalSessionsPlayed: totalPlayed,
        badges: newBadges,
        games: {
          ...prev.games,
          [gameId]: {
            ...gameData,
            sessions: updatedSessions,
            bestScore: Math.max(gameData.bestScore, score),
            timesPlayed: gameData.timesPlayed + 1,
          },
        },
      }
    })

    // Persist to Supabase if signed in
    if (user) {
      // Save session
      await supabase.from('game_sessions').insert({
        user_id:   user.id,
        game_id:   gameId,
        score,
        accuracy,
      })

      // Save any new badges
      const currentBadges = progress.badges
      const potentialNew = []
      const totalPlayed = progress.totalSessionsPlayed + 1
      if (totalPlayed === 1  && !currentBadges.includes('first_session')) potentialNew.push('first_session')
      if (totalPlayed === 10 && !currentBadges.includes('ten_sessions'))  potentialNew.push('ten_sessions')
      if (score >= 100       && !currentBadges.includes('perfect_100'))   potentialNew.push('perfect_100')

      if (potentialNew.length > 0) {
        await supabase.from('user_badges').upsert(
          potentialNew.map(badge_id => ({ user_id: user.id, badge_id })),
          { onConflict: 'user_id,badge_id' }
        )
      }

      // Refresh from DB to keep streak accurate
      await loadFromSupabase(user.id)
    }
  }

  async function resetProgress() {
    if (user) {
      await Promise.all([
        supabase.from('game_sessions').delete().eq('user_id', user.id),
        supabase.from('user_badges').delete().eq('user_id', user.id),
      ])
      setProgress({ ...DEFAULT_PROGRESS })
    } else {
      localStorage.removeItem('brainboost_progress')
      setProgress({ ...DEFAULT_PROGRESS })
    }
  }

  return (
    <ProgressContext.Provider value={{ progress, recordSession, resetProgress, syncing }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
