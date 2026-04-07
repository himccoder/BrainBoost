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
  const [phase, setPhase] = useState('intro') // intro | playing | result
  const [round, setRound] = useState(null)
  const [roundNum, setRoundNum] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [timeLeft, setTimeLeft] = useState(4)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [missedTime, setMissedTime] = useState(0)
  const timerRef = useRef(null)
  const roundRef = useRef(null)

  const finishGame = useCallback((c, missed) => {
    const total = ROUNDS
    const accuracy = Math.round(((c) / total) * 100)
    const score = Math.round(accuracy)
    recordSession('stroop', score, accuracy)
    setPhase('result')
  }, [recordSession])

  const nextRound = useCallback((currentCorrect, currentMissed, num) => {
    clearInterval(timerRef.current)
    if (num >= ROUNDS) {
      finishGame(currentCorrect, currentMissed)
      return
    }
    const r = makeRound()
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

  function startGame() {
    setCorrect(0)
    setMissedTime(0)
    setPhase('playing')
    nextRound(0, 0, 0)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  function handleAnswer(colorName) {
    clearInterval(timerRef.current)
    const isCorrect = colorName === roundRef.current?.ink.name
    setFeedback(isCorrect ? 'correct' : 'wrong')
    const newCorrect = isCorrect ? correct + 1 : correct
    if (isCorrect) { setCorrect(newCorrect); sounds.correct() } else { sounds.wrong() }
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
            <h2 className="font-display text-2xl text-slate-800 mb-3">Stroop Color Test</h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              You&apos;ll see a <strong>color word</strong> printed in a different ink color.
              <br />Your job: <strong>name the ink color</strong>, not what the word says.
            </p>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-4 text-left">
              <div className="text-sm font-semibold text-sky-700 mb-2">Example:</div>
              <p className="text-4xl font-bold mb-1" style={{ color: '#3b82f6' }}>RED</p>
              <p className="text-slate-500 text-sm">The word says "RED" but the correct answer is <strong className="text-blue-600">Blue</strong> — that&apos;s the ink color.</p>
            </div>
            <p className="text-slate-400 text-sm mb-6">You have 4 seconds per round. {ROUNDS} rounds total.</p>
            <button onClick={startGame} className="btn-primary w-full">Start Game</button>
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
            feedback === 'wrong'   ? 'bg-red-50 border-red-100'    : ''
          }`}>
            <p className="text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider">What color is the INK?</p>
            <p
              className="text-7xl font-black mb-4 leading-none"
              style={{ color: round.ink.css }}
            >
              {round.word.name}
            </p>
            {feedback && (
              <div className={`text-sm font-semibold animate-fade-in ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
                {feedback === 'correct' ? '✓ Correct!' : `✗ It was ${round.ink.name}`}
              </div>
            )}
          </div>

          {/* Answer buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {COLORS.map(c => (
              <button
                key={c.name}
                onClick={() => !feedback && handleAnswer(c.name)}
                disabled={!!feedback}
                className="py-3 rounded-xl font-semibold text-white text-sm transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: c.css }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Score */}
          <div className="text-center mt-6 text-slate-400 text-sm">
            Correct so far: <strong className="text-teal-600">{correct}</strong>
          </div>
        </div>
      )}
    </GameWrapper>
  )
}
