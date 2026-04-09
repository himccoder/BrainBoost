import { useState, useEffect, useCallback, useRef } from 'react'
import GameWrapper from '../../components/GameWrapper'
import GameResult from '../../components/GameResult'
import { useProgress } from '../../context/ProgressContext'
import { GAMES } from '../../data/games'
import { sounds } from '../../lib/sounds'

const game = GAMES.find(g => g.id === 'sequence')

const GRID_SIZE = 9
const TILE_COLORS = ['bg-blue-400', 'bg-indigo-500', 'bg-blue-500']

const SEQ_MODES = [
  { id: 'forward',  label: 'Forward',  desc: 'Repeat the sequence in the same order.' },
  { id: 'reverse',  label: 'Reverse',  desc: 'Repeat the sequence in reverse order.' },
  { id: 'colors',   label: 'Colours',  desc: 'Tiles flash in different colours — remember each one.' },
]

const COLOR_TILES = ['#6366f1','#14b8a6','#f59e0b','#ef4444','#8b5cf6']

function buildGrid() {
  return Array.from({ length: GRID_SIZE }, (_, i) => i)
}

export default function SequenceGame() {
  const { recordSession } = useProgress()
  const [seqMode, setSeqMode]         = useState('forward')
  const [phase, setPhase]             = useState('intro')
  const [level, setLevel]             = useState(3)
  const [sequence, setSequence]       = useState([])
  const [colorSeq, setColorSeq]       = useState([])
  const [playerSeq, setPlayerSeq]     = useState([])
  const [active, setActive]           = useState(null)
  const [activeColor, setActiveColor] = useState(null)
  const [bestLevel, setBestLevel]     = useState(3)
  const [lives, setLives]             = useState(3)
  const [flashId, setFlashId]         = useState(null)
  const seqModeRef  = useRef(seqMode)
  const startTime   = useRef(null)

  const showSequence = useCallback((seq, cols) => {
    setPhase('showing')
    setPlayerSeq([])
    let i = 0
    const interval = setInterval(() => {
      sounds.tileShow()
      setActive(seq[i])
      if (cols) setActiveColor(cols[i])
      setTimeout(() => { setActive(null); setActiveColor(null) }, 500)
      i++
      if (i >= seq.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('input'), 800)
      }
    }, 900)
  }, [])

  function startLevel(len = level) {
    const seq  = Array.from({ length: len }, () => Math.floor(Math.random() * GRID_SIZE))
    const cols = seqModeRef.current === 'colors'
      ? Array.from({ length: len }, () => COLOR_TILES[Math.floor(Math.random() * COLOR_TILES.length)])
      : null
    setSequence(seq)
    setColorSeq(cols || [])
    setPlayerSeq([])
    showSequence(seq, cols)
  }

  function startGame(m = seqMode) {
    seqModeRef.current = m
    startTime.current  = Date.now()
    setLives(3)
    setBestLevel(3)
    setLevel(3)
    startLevel(3)
  }

  function handleTileClick(id) {
    if (phase !== 'input') return
    sounds.tileTap()
    setFlashId(id)
    setTimeout(() => setFlashId(null), 200)

    const newPlayerSeq = [...playerSeq, id]
    setPlayerSeq(newPlayerSeq)

    const targetSeq = seqModeRef.current === 'reverse' ? [...sequence].reverse() : sequence
    const pos = newPlayerSeq.length - 1
    if (id !== targetSeq[pos]) {
      sounds.wrong()
      const newLives = lives - 1
      setLives(newLives)
      setPhase('wrong')
      setTimeout(() => {
        if (newLives <= 0) {
          const accuracy = Math.round((bestLevel / (bestLevel + 3)) * 100)
          const score    = (bestLevel - 3) * 10 + (bestLevel >= 6 ? 20 : 0)
          const duration = startTime.current ? Math.round((Date.now() - startTime.current) / 1000) : null
          recordSession('sequence', score, accuracy, duration)
          setPhase('result')
        } else {
          showSequence(sequence, colorSeq.length > 0 ? colorSeq : null)
        }
      }, 1000)
      return
    }

    if (newPlayerSeq.length === sequence.length) {
      sounds.levelUp()
      const nextLevel = level + 1
      const newBest = Math.max(bestLevel, nextLevel)
      setLevel(nextLevel)
      setBestLevel(newBest)
      setPhase('correct')
      setTimeout(() => startLevel(nextLevel), 1200)
    }
  }

  const accuracy = bestLevel > 3 ? Math.round(((bestLevel - 3) / bestLevel) * 100) : 50
  const score = Math.max(0, (bestLevel - 3) * 15)

  if (phase === 'result') {
    return (
      <GameWrapper game={game}>
        <GameResult
          score={score}
          accuracy={accuracy}
          onReplay={() => setPhase('intro')}
          message={`You reached sequence length ${bestLevel}! Your working memory just got a workout. 🧠`}
        />
      </GameWrapper>
    )
  }

  return (
    <GameWrapper game={game}>
      {phase === 'intro' && (
        <div className="max-w-lg mx-auto text-center animate-slide-up">
          <div className="card mb-6">
            <div className="text-5xl mb-4">🔢</div>
            <h2 className="font-display text-2xl text-slate-800 mb-3">Sequence Recall</h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              Watch the tiles light up in a sequence, then tap them back in the <strong>same order</strong>.
              Each correct round adds one more tile to the sequence.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {SEQ_MODES.map(m => (
                <button key={m.id} onClick={() => setSeqMode(m.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${seqMode === m.id ? 'border-blue-400 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 ${seqMode === m.id ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`} />
                  <div>
                    <div className="font-semibold text-slate-700 text-sm">{m.label}</div>
                    <div className="text-slate-400 text-xs">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => startGame(seqMode)} className="btn-primary w-full">Start Game</button>
          </div>
        </div>
      )}

      {['showing', 'input', 'correct', 'wrong'].includes(phase) && (
        <div className="max-w-lg mx-auto animate-fade-in">
          {/* HUD */}
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white rounded-xl border border-slate-100 px-4 py-2 shadow-sm text-center">
              <div className="text-xl font-bold text-blue-500">{level}</div>
              <div className="text-xs text-slate-400">Length</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-semibold px-4 py-2 rounded-xl ${
                phase === 'showing' ? 'bg-indigo-50 text-indigo-700' :
                phase === 'input'   ? 'bg-blue-50 text-blue-700' :
                phase === 'correct' ? 'bg-teal-50 text-teal-700' :
                                     'bg-slate-100 text-slate-600'
              }`}>
                {phase === 'showing' ? '👁  Watch...' :
                 phase === 'input'   ? '👆 Your turn!' :
                 phase === 'correct' ? '✓ Correct! Next level...' :
                                      '✗ Try again...'}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 px-4 py-2 shadow-sm text-center">
              <div className="text-xl font-bold text-rose-500">{'❤️'.repeat(lives)}</div>
              <div className="text-xs text-slate-400">Lives</div>
            </div>
          </div>

          {/* Tile grid */}
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {buildGrid().map(id => {
                const isFlashing = active === id || flashId === id
                const style = isFlashing && seqMode === 'colors' && activeColor
                  ? { backgroundColor: activeColor, borderColor: activeColor }
                  : undefined
                return (
                  <button key={id} onClick={() => handleTileClick(id)}
                    className={`aspect-square rounded-2xl border-2 font-bold text-white text-xl shadow-sm transition-all duration-150
                      ${isFlashing
                        ? 'scale-110 shadow-lg bg-blue-300 border-blue-400'
                        : phase === 'input'
                          ? 'bg-blue-500 border-blue-600 hover:bg-blue-400 hover:scale-105 cursor-pointer active:scale-95'
                          : 'bg-blue-500 border-blue-600 cursor-default opacity-75'}
                      ${playerSeq.includes(id) && phase === 'input' ? 'opacity-40' : ''}
                    `}
                    style={style}
                  >{seqMode !== 'colors' && (id + 1)}</button>
                )
              })}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i < playerSeq.length ? 'bg-blue-400 scale-110' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-slate-400 text-sm mt-2">
            {playerSeq.length} / {sequence.length} tapped
          </div>
        </div>
      )}
    </GameWrapper>
  )
}
