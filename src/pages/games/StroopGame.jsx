import { useState, useEffect, useRef, useCallback } from 'react'
import GameWrapper from '../../components/GameWrapper'
import GameResult from '../../components/GameResult'
import { useProgress } from '../../context/ProgressContext'
import { GAMES } from '../../data/games'
import { sounds } from '../../lib/sounds'

const game = GAMES.find(g => g.id === 'stroop')

const COLORS = [
  { name: 'Red',    css: '#ef4444' },
  { name: 'Blue',   css: '#3b82f6' },
  { name: 'Green',  css: '#22c55e' },
  { name: 'Yellow', css: '#eab308' },
  { name: 'Purple', css: '#a855f7' },
  { name: 'Orange', css: '#f97316' },
]

// Number-count Stroop: word says a number (ONE–FIVE) but N dots are shown — name the count
const COUNT_WORDS = ['ONE','TWO','THREE','FOUR','FIVE']
const COUNT_LABELS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 }

function makeCountRound() {
  const word  = COUNT_WORDS[Math.floor(Math.random() * COUNT_WORDS.length)]
  let count   = Math.floor(Math.random() * 5) + 1
  if (Math.random() > 0.35) while (count === COUNT_LABELS[word]) count = Math.floor(Math.random() * 5) + 1
  return { word, count }
}

const MODES = [
  { id: 'color', label: 'Colour-Word', desc: 'Name the ink colour, not the word.' },
  { id: 'count', label: 'Number Count', desc: 'Count the dots — ignore what the number says.' },
  { id: 'mixed', label: 'Mixed', desc: 'Colour and count rounds alternate — stay sharp!' },
]

const ROUNDS = 15

function makeRound() {
  const word  = COLORS[Math.floor(Math.random() * COLORS.length)]
  let ink = COLORS[Math.floor(Math.random() * COLORS.length)]
  // ~60% chance of incongruent (harder, more training)
  if (Math.random() > 0.4) {
    while (ink.name === word.name) {
      ink = COLORS[Math.floor(Math.random() * COLORS.length)]
    }
  }
  return { word, ink }
}

export default function StroopGame() {
  const { recordSession } = useProgress()
  const [mode, setMode]       = useState('color')
  const [phase, setPhase]     = useState('intro')
  const [round, setRound]     = useState(null)
  const [roundNum, setRoundNum] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [timeLeft, setTimeLeft] = useState(4)
  const [feedback, setFeedback] = useState(null)
  const [missedTime, setMissedTime] = useState(0)
  const timerRef    = useRef(null)
  const roundRef    = useRef(null)
  const modeRef     = useRef(mode)
  const startTime   = useRef(null)

  const finishGame = useCallback((c, missed) => {
    const total    = ROUNDS
    const accuracy = Math.round((c / total) * 100)
    const score    = Math.round(accuracy)
    const duration = startTime.current ? Math.round((Date.now() - startTime.current) / 1000) : null
    recordSession('stroop', score, accuracy, duration)
    setPhase('result')
  }, [recordSession])

  const nextRound = useCallback((currentCorrect, currentMissed, num) => {
    clearInterval(timerRef.current)
    if (num >= ROUNDS) {
      finishGame(currentCorrect, currentMissed)
      return
    }
    const m = modeRef.current
    const useCount = m === 'count' || (m === 'mixed' && num % 2 === 1)
    const r = useCount ? { type: 'count', ...makeCountRound() } : { type: 'color', ...makeRound() }
    setRound(r)
    roundRef.current = r
    setRoundNum(num)
    setFeedback(null)
    setTimeLeft(4)

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          sounds.wrong()
          setFeedback('wrong')
          setTimeout(() => nextRound(currentCorrect, currentMissed + 1, num + 1), 600)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [finishGame])

  function startGame(m = mode) {
    modeRef.current  = m
    startTime.current = Date.now()
    setCorrect(0)
    setMissedTime(0)
    setPhase('playing')
    nextRound(0, 0, 0)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  function handleAnswer(value) {
    clearInterval(timerRef.current)
    const r = roundRef.current
    const isCorrect = r?.type === 'count'
      ? Number(value) === r.count
      : value === r?.ink.name
    if (isCorrect) sounds.correct(); else sounds.wrong()
    setFeedback(isCorrect ? 'correct' : 'wrong')
    const newCorrect = isCorrect ? correct + 1 : correct
    if (isCorrect) setCorrect(newCorrect)
    setTimeout(() => nextRound(newCorrect, missedTime, roundNum + 1), 600)
  }

  const accuracy = Math.round((correct / ROUNDS) * 100)
  const score = accuracy

  if (phase === 'result') {
    return (
      <GameWrapper game={game}>
        <GameResult score={score} accuracy={accuracy} onReplay={() => setPhase('intro')} />
      </GameWrapper>
    )
  }

  return (
    <GameWrapper game={game}>
      {phase === 'intro' && (
        <div className="max-w-lg mx-auto text-center animate-slide-up">
          <div className="card mb-6">
            <div className="text-5xl mb-4">🎨</div>
            <h2 className="font-display text-2xl text-slate-800 mb-3">Stroop Test</h2>
            <div className="flex flex-col gap-2 mb-5">
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${mode === m.id ? 'border-sky-400 bg-sky-50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 ${mode === m.id ? 'bg-sky-500 border-sky-500' : 'border-slate-300'}`} />
                  <div>
                    <div className="font-semibold text-slate-700 text-sm">{m.label}</div>
                    <div className="text-slate-400 text-xs">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-sm mb-4">{ROUNDS} rounds · 4 seconds each</p>
            <button onClick={() => startGame(mode)} className="btn-primary w-full">Start Game</button>
          </div>
        </div>
      )}

      {phase === 'playing' && round && (
        <div className="max-w-lg mx-auto animate-fade-in">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">Round {roundNum + 1} of {ROUNDS}</span>
            <span className={`text-sm font-bold ${timeLeft <= 1 ? 'text-red-400' : 'text-slate-600'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 4) * 100}%` }}
            />
          </div>

          {/* Word display */}
          <div className={`card text-center mb-6 transition-all duration-200 ${
            feedback === 'correct' ? 'bg-emerald-50 border-emerald-200' :
            feedback === 'wrong'   ? 'bg-red-50 border-red-100' : ''
          }`}>
            {round.type === 'color' ? (
              <>
                <p className="text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider">What colour is the INK?</p>
                <p className="text-7xl font-black mb-4 leading-none" style={{ color: round.ink.css }}>{round.word.name}</p>
                {feedback && <div className={`text-sm font-semibold ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {feedback === 'correct' ? '✓ Correct!' : `✗ It was ${round.ink.name}`}
                </div>}
              </>
            ) : (
              <>
                <p className="text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider">How many dots do you see?</p>
                <div className="flex items-center justify-center gap-2 flex-wrap mb-3 min-h-[56px]">
                  {Array.from({ length: round.count }).map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-indigo-400" />
                  ))}
                </div>
                <p className="text-2xl font-black text-slate-300 mb-3">{round.word}</p>
                {feedback && <div className={`text-sm font-semibold ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {feedback === 'correct' ? '✓ Correct!' : `✗ There were ${round.count}`}
                </div>}
              </>
            )}
          </div>

          {/* Answer buttons */}
          {round.type === 'color' ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COLORS.map(c => (
                <button key={c.name} onClick={() => !feedback && handleAnswer(c.name)} disabled={!!feedback}
                  className="py-3 rounded-xl font-semibold text-white text-xs transition-all hover:scale-105 active:scale-95 shadow-sm disabled:opacity-60"
                  style={{ backgroundColor: c.css }}>{c.name}</button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => !feedback && handleAnswer(n)} disabled={!!feedback}
                  className="py-4 rounded-xl font-bold text-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-2 border-indigo-100 hover:border-indigo-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-60">
                  {n}
                </button>
              ))}
            </div>
          )}

          {/* Score */}
          <div className="text-center mt-6 text-slate-400 text-sm">
            Correct so far: <strong className="text-teal-600">{correct}</strong>
          </div>
        </div>
      )}
    </GameWrapper>
  )
}
