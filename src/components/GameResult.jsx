import { Link } from 'react-router-dom'
import { RotateCcw, ChevronRight, TrendingUp } from 'lucide-react'

const ENCOURAGEMENTS = [
  "Outstanding work! Your hippocampus thanks you. 🧠",
  "Every session builds stronger neural pathways. Keep going! ⚡",
  "You just made your brain measurably stronger. Incredible! 💪",
  "Consistency is the key to neuroplasticity — you're doing it! 🧠",
  "Science-backed progress. You should be proud of this! 🔬",
]

export default function GameResult({ score, accuracy, onReplay, message }) {
  const msg = message || ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]

  const grade =
    accuracy >= 90 ? { label: 'Excellent',  color: 'text-teal-700 bg-teal-50 border-teal-100',       emoji: '🏆', bar: 'from-teal-400 to-cyan-400'     } :
    accuracy >= 70 ? { label: 'Good',       color: 'text-blue-700 bg-blue-50 border-blue-100',       emoji: '⭐', bar: 'from-blue-400 to-indigo-400'    } :
    accuracy >= 50 ? { label: 'Keep going', color: 'text-indigo-700 bg-indigo-50 border-indigo-100', emoji: '💪', bar: 'from-indigo-300 to-violet-400'  } :
                     { label: 'Try again',  color: 'text-sky-700 bg-sky-50 border-sky-100',          emoji: '🧠', bar: 'from-sky-300 to-blue-400'        }

  return (
    <div className="max-w-sm mx-auto text-center py-8 animate-pop">
      {/* Emoji floating above card */}
      <div className="text-6xl mb-4 animate-bounce-soft">{grade.emoji}</div>

      <div className="card shadow-md">
        <h2 className="font-display text-3xl text-slate-900 mb-1">Session Complete!</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{msg}</p>

        {/* Score row */}
        <div className="flex justify-center gap-8 mb-5">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 tabular-nums">{score}</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-widest">Score</div>
          </div>
          <div className="w-px bg-slate-100" />
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 tabular-nums">{accuracy}%</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-widest">Accuracy</div>
          </div>
        </div>

        {/* Accuracy bar */}
        <div className="h-2 bg-slate-100 rounded-full mb-4 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${grade.bar} transition-all duration-700`}
            style={{ width: `${accuracy}%` }}
          />
        </div>

        <div className={`inline-flex items-center text-sm font-semibold px-4 py-1.5 rounded-full border mb-6 ${grade.color}`}>
          {grade.label}
        </div>

        {/* Brain science panel */}
        <div className="bg-gradient-to-br from-brand-50 to-teal-50 rounded-2xl p-4 mb-6 text-left border border-brand-50">
          <div className="flex items-center gap-2 text-brand-700 text-xs font-semibold mb-1.5 uppercase tracking-wide">
            <TrendingUp size={13} /> What just happened in your brain
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Your neurons fired in coordinated patterns, and through synaptic potentiation,
            those connections became slightly stronger. This is neuroplasticity in action — every session counts.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button onClick={onReplay} className="btn-primary flex items-center justify-center gap-2">
            <RotateCcw size={15} /> Play Again
          </button>
          <Link to="/games" className="btn-secondary flex items-center justify-center gap-2">
            Try Another Game <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
