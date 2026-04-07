import { useState, useEffect, useCallback } from 'react'
import GameWrapper from '../../components/GameWrapper'
import GameResult from '../../components/GameResult'
import { useProgress } from '../../context/ProgressContext'
import { GAMES } from '../../data/games'
import { sounds } from '../../lib/sounds'

const EMOJI_SETS = {
  easy:   ['🌸', '🌿', '🦋', '🌙', '⭐', '🍀'],
  medium: ['🌸', '🌿', '🦋', '🌙', '⭐', '🍀', '🐢', '🦜'],
  hard:   ['🌸', '🌿', '🦋', '🌙', '⭐', '🍀', '🐢', '🦜', '🌊', '🔮'],
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeCards(level) {
  const emojis = EMOJI_SETS[level]
  return shuffle([...emojis, ...emojis].map((e, i) => ({
    id: i,
    emoji: e,
    flipped: false,
    matched: false,
  })))
}

const game = GAMES.find(g => g.id === 'memory')

export default function MemoryGame() {
  const { recordSession } = useProgress()
  const [level, setLevel] = useState('easy')
  const [cards, setCards] = useState(() => makeCards('easy'))
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [locked, setLocked] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const totalPairs = cards.length / 2

  const resetGame = useCallback((lvl = level) => {
    setCards(makeCards(lvl))
    setFlipped([])
    setMoves(0)
    setMatches(0)
    setLocked(false)
    setGameOver(false)
    setStarted(false)
  }, [level])

  function handleCardClick(id) {
    if (locked || flipped.includes(id)) return
    if (cards.find(c => c.id === id)?.matched) return
    if (!started) setStarted(true)

    sounds.cardFlip()
    const newFlipped = [...flipped, id]
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c))
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setLocked(true)
      setMoves(m => m + 1)
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid))

      if (a.emoji === b.emoji) {
        sounds.cardMatch()
        setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c))
        setFlipped([])
        setLocked(false)
        const newMatches = matches + 1
        setMatches(newMatches)
        if (newMatches === totalPairs) {
          const accuracy = Math.max(0, Math.round(100 - ((moves + 1 - totalPairs) / totalPairs) * 50))
          const score = Math.max(0, 100 - (moves + 1 - totalPairs) * 5)
          setTimeout(() => sounds.sessionComplete(), 200)
          recordSession('memory', score, accuracy)
          setGameOver(true)
        }
      } else {
        sounds.cardMismatch()
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c))
          setFlipped([])
          setLocked(false)
        }, 1000)
      }
    }
  }

  const accuracy = moves > 0 ? Math.max(0, Math.round(100 - ((moves - totalPairs) / totalPairs) * 50)) : 100
  const score = Math.max(0, 100 - (moves - totalPairs) * 5)

  const cols = cards.length === 12 ? 'grid-cols-4 sm:grid-cols-6' :
               cards.length === 16 ? 'grid-cols-4 sm:grid-cols-4' :
               'grid-cols-4 sm:grid-cols-5'

  if (gameOver) {
    return (
      <GameWrapper game={game}>
        <GameResult
          score={Math.max(0, score)}
          accuracy={Math.max(0, accuracy)}
          onReplay={() => resetGame()}
        />
      </GameWrapper>
    )
  }

  return (
    <GameWrapper game={game}>
      {/* Level selector */}
      {!started && (
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="font-display text-2xl text-slate-800 mb-2">Memory Card Match</h2>
          <p className="text-slate-500 mb-6 text-sm">Find all matching pairs. The fewer attempts, the better your score.</p>
          <div className="flex justify-center gap-3 mb-6">
            {['easy', 'medium', 'hard'].map(lvl => (
              <button
                key={lvl}
                onClick={() => { setLevel(lvl); resetGame(lvl) }}
                className={`capitalize px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  level === lvl
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
          <div className="text-slate-400 text-sm">Click any card to start</div>
        </div>
      )}

      {/* Stats bar */}
      {started && (
        <div className="flex justify-between items-center mb-6 bg-white rounded-xl border border-slate-100 px-4 py-3 shadow-sm">
          <div className="text-center">
            <div className="text-xl font-bold text-indigo-500">{matches}</div>
            <div className="text-xs text-slate-400">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-slate-700">{totalPairs - matches}</div>
            <div className="text-xs text-slate-400">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-slate-600">{moves}</div>
            <div className="text-xs text-slate-400">Attempts</div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {started && (
        <div className="mb-6">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${(matches / totalPairs) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 text-right mt-1">{matches}/{totalPairs} pairs found</div>
        </div>
      )}

      {/* Card grid */}
      <div className={`grid ${cols} gap-3 justify-items-center`}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl flex items-center justify-center transition-all duration-300 font-medium shadow-sm
              ${card.matched
                ? 'bg-indigo-100 border-2 border-indigo-200 scale-95 cursor-default'
                : card.flipped
                  ? 'bg-white border-2 border-indigo-300 shadow-md scale-105'
                  : 'bg-gradient-to-br from-indigo-400 to-violet-500 border-2 border-indigo-500 hover:scale-105 hover:shadow-md cursor-pointer'
              }`}
          >
            {(card.flipped || card.matched) ? card.emoji : (
              <span className="text-white text-xl">?</span>
            )}
          </button>
        ))}
      </div>

      {started && (
        <div className="text-center mt-8">
          <button
            onClick={() => resetGame()}
            className="text-slate-400 hover:text-slate-600 text-sm underline underline-offset-2"
          >
            Restart
          </button>
        </div>
      )}
    </GameWrapper>
  )
}
