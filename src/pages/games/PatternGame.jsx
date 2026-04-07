import { useState, useCallback } from 'react'
import GameWrapper from '../../components/GameWrapper'
import GameResult from '../../components/GameResult'
import { useProgress } from '../../context/ProgressContext'
import { GAMES } from '../../data/games'
import { sounds } from '../../lib/sounds'

const game = GAMES.find(g => g.id === 'pattern')

// Pattern types: color sequences, shape sequences, number sequences
const SHAPES = ['●', '■', '▲', '◆', '★', '✿']
const COLORS_CSS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981']

function makeColorPattern(difficulty) {
  const len = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5
  const choices = COLORS_CSS.slice(0, len + 2)
  const patternColors = Array.from({ length: len }, (_, i) => choices[i % choices.length])
  const nextColor = choices[len % choices.length]
  const wrongColors = choices.filter(c => c !== nextColor).slice(0, 3)
  const options = shuffleArr([nextColor, ...wrongColors.slice(0, 3)])
  return {
    type: 'color',
    sequence: patternColors,
    answer: nextColor,
    options,
    hint: 'What color comes next in the repeating pattern?',
  }
}

function makeShapePattern(difficulty) {
  const len = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5
  const shapeList = SHAPES.slice(0, 3)
  const sequence = Array.from({ length: len }, (_, i) => shapeList[i % shapeList.length])
  const nextShape = shapeList[len % shapeList.length]
  const wrong = SHAPES.filter(s => s !== nextShape).slice(0, 3)
  const options = shuffleArr([nextShape, ...wrong])
  return {
    type: 'shape',
    sequence,
    answer: nextShape,
    options,
    hint: 'Which shape comes next in the sequence?',
  }
}

function makeNumberPattern(difficulty) {
  const step = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : Math.floor(Math.random() * 4) + 2
  const start = Math.floor(Math.random() * 5) + 1
  const len = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5
  const sequence = Array.from({ length: len }, (_, i) => start + i * step)
  const nextNum = start + len * step
  const wrong = [nextNum + 1, nextNum - 1, nextNum + step].filter(n => n !== nextNum)
  const options = shuffleArr([nextNum, ...wrong.slice(0, 3)])
  return {
    type: 'number',
    sequence,
    answer: nextNum,
    options,
    hint: `Numbers increase by ${step} each time. What comes next?`,
  }
}

function shuffleArr(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeQuestion(difficulty) {
  const types = ['color', 'shape', 'number']
  const type = types[Math.floor(Math.random() * types.length)]
  if (type === 'color')  return makeColorPattern(difficulty)
  if (type === 'shape')  return makeShapePattern(difficulty)
  return makeNumberPattern(difficulty)
}

const TOTAL_QUESTIONS = 10

export default function PatternGame() {
  const { recordSession } = useProgress()
  const [phase, setPhase] = useState('intro')
  const [difficulty, setDifficulty] = useState('easy')
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [selected, setSelected] = useState(null)

  function startGame(diff = difficulty) {
    const qs = Array.from({ length: TOTAL_QUESTIONS }, () => makeQuestion(diff))
    setQuestions(qs)
    setQIdx(0)
    setCorrect(0)
    setFeedback(null)
    setSelected(null)
    setPhase('playing')
  }

  function handleAnswer(option) {
    if (feedback) return
    const q = questions[qIdx]
    const isCorrect = option === q.answer || String(option) === String(q.answer)
    setSelected(option)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) sounds.correct(); else sounds.wrong()
    const newCorrect = isCorrect ? correct + 1 : correct

    setTimeout(() => {
      const nextIdx = qIdx + 1
      if (nextIdx >= TOTAL_QUESTIONS) {
        const accuracy = Math.round((newCorrect / TOTAL_QUESTIONS) * 100)
        const score = accuracy
        recordSession('pattern', score, accuracy)
        setCorrect(newCorrect)
        setTimeout(() => sounds.sessionComplete(), 300)
        setPhase('result')
      } else {
        setCorrect(newCorrect)
        setQIdx(nextIdx)
        setFeedback(null)
        setSelected(null)
      }
    }, 1000)
  }

  const accuracy = Math.round((correct / TOTAL_QUESTIONS) * 100)
  const score = accuracy

  if (phase === 'result') {
    return (
      <GameWrapper game={game}>
        <GameResult score={score} accuracy={accuracy} onReplay={() => setPhase('intro')} />
      </GameWrapper>
    )
  }

  const q = questions[qIdx]

  return (
    <GameWrapper game={game}>
      {phase === 'intro' && (
        <div className="max-w-lg mx-auto text-center animate-slide-up">
          <div className="card mb-6">
            <div className="text-5xl mb-4">🔷</div>
            <h2 className="font-display text-2xl text-slate-800 mb-3">Pattern Recognition</h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              You&apos;ll see a sequence of colors, shapes, or numbers. Find the hidden rule and
              choose <strong>what comes next</strong>.
            </p>
            <div className="flex justify-center gap-3 mb-6">
              {['easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`capitalize px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    difficulty === d
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-sm mb-6">{TOTAL_QUESTIONS} patterns to solve.</p>
            <button onClick={() => startGame()} className="btn-primary w-full">Start Game</button>
          </div>
        </div>
      )}

      {phase === 'playing' && q && (
        <div className="max-w-lg mx-auto animate-fade-in">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">Question {qIdx + 1} of {TOTAL_QUESTIONS}</span>
            <span className="text-sm font-semibold text-teal-600">{correct} correct</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${((qIdx) / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>

          <div className={`card mb-6 transition-colors ${
            feedback === 'correct' ? 'bg-emerald-50 border-emerald-200' :
            feedback === 'wrong'   ? 'bg-red-50 border-red-100' : ''
          }`}>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide text-center mb-5">{q.hint}</p>

            {/* Sequence display */}
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              {q.sequence.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SequenceItem q={q} item={item} />
                  <span className="text-slate-300 text-lg">→</span>
                </div>
              ))}
              {/* Mystery box */}
              <div className="w-14 h-14 rounded-xl border-2 border-dashed border-teal-400 bg-teal-50 flex items-center justify-center text-teal-400 text-2xl font-bold">
                ?
              </div>
            </div>

            {feedback && (
              <div className={`text-center text-sm font-semibold mb-2 ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
                {feedback === 'correct' ? '✓ Correct!' : `✗ The answer was: ${q.type === 'color' ? '(see below)' : q.answer}`}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                disabled={!!feedback}
                className={`py-4 rounded-xl font-semibold text-sm transition-all border-2 flex items-center justify-center gap-2
                  ${selected === option
                    ? feedback === 'correct'
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-700 scale-105'
                      : 'bg-red-50 border-red-300 text-red-600'
                    : option === q.answer && feedback === 'wrong'
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:scale-105'
                  }
                  disabled:cursor-not-allowed
                `}
              >
                <SequenceItem q={q} item={option} small />
                {q.type === 'number' && <span>{option}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </GameWrapper>
  )
}

function SequenceItem({ q, item, small }) {
  const size = small ? 'w-8 h-8 text-xl' : 'w-14 h-14 text-3xl'
  if (q.type === 'color') {
    return (
      <div
        className={`${size} rounded-xl shadow-sm border-2 border-white`}
        style={{ backgroundColor: item }}
      />
    )
  }
  if (q.type === 'shape') {
    return (
      <div className={`${size} rounded-xl bg-teal-100 flex items-center justify-center font-bold text-teal-700`}>
        {item}
      </div>
    )
  }
  return (
    <div className={`${size} rounded-xl bg-brand-100 flex items-center justify-center font-bold text-brand-700 ${small ? 'text-sm' : 'text-2xl'}`}>
      {item}
    </div>
  )
}
