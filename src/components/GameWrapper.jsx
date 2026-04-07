import { Link } from 'react-router-dom'
import { ChevronLeft, Info } from 'lucide-react'
import { useState } from 'react'

export default function GameWrapper({ game, children }) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Game header */}
      <div className={`bg-gradient-to-r ${game.color} text-white py-4 px-4 sm:px-6`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/games" className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors">
            <ChevronLeft size={16} /> All games
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xl">{game.icon}</span>
            <div>
              <h1 className="font-display text-xl leading-tight">{game.title}</h1>
              <div className="text-white/70 text-xs">{game.domain}</div>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(v => !v)}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Info size={13} /> Why this game?
          </button>
        </div>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="bg-white border-b border-slate-100 shadow-sm animate-slide-up">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2 text-sm flex items-center gap-2">
                  🧠 What this trains
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{game.shortBio}</p>
              </div>
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                <h3 className="font-semibold text-teal-800 mb-2 text-xs uppercase tracking-wide">Research says</h3>
                <p className="text-slate-600 text-sm leading-relaxed italic">{game.scienceFact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  )
}
