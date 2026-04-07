import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock, BarChart2, Microscope, Lightbulb, ChevronDown, ChevronUp, Dna } from 'lucide-react'
import { GAMES } from '../data/games'
import { useProgress } from '../context/ProgressContext'

function GameDetailCard({ game }) {
  const [expanded, setExpanded] = useState(false)
  const { progress } = useProgress()
  const gameStats = progress.games[game.id]

  return (
    <div className={`bg-white rounded-2xl border ${game.cardColor} shadow-sm overflow-hidden`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${game.color} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-4xl mb-3">{game.icon}</div>
            <h2 className="font-display text-2xl mb-1">{game.title}</h2>
            <p className="text-white/80 text-sm font-medium">{game.tagline}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            {gameStats.timesPlayed > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                <div className="font-bold text-lg">{gameStats.timesPlayed}</div>
                <div className="text-white/80 text-xs">sessions</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <BarChart2 size={11} /> {game.domain}
          </span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <Clock size={11} /> {game.duration}
          </span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {game.difficulty}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Short bio */}
        <p className="text-slate-600 leading-relaxed mb-5">{game.shortBio}</p>

        {/* Brain region quick stat */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm">
            <Dna size={14} className="text-brand-500" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Brain Region</div>
              <div className="text-slate-700 font-semibold text-xs">{game.brainRegion}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm">
            <Microscope size={14} className="text-teal-500" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Mechanism</div>
              <div className="text-slate-700 font-semibold text-xs">{game.mechanism}</div>
            </div>
          </div>
        </div>

        {/* Expandable science section */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center justify-between text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl px-4 py-3 transition-colors mb-4"
        >
          <span className="flex items-center gap-2">
            <Lightbulb size={15} />
            Why should I play this? (The science)
          </span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expanded && (
          <div className="mb-5 animate-slide-up">
            <div className="bg-slate-50 rounded-xl p-5 mb-4">
              <p className="text-slate-600 leading-relaxed text-sm">{game.whyPlay}</p>
            </div>

            {/* Science fact */}
            <div className="bg-gradient-to-r from-teal-50 to-brand-50 border border-teal-100 rounded-xl p-4 mb-4">
              <div className="flex gap-3">
                <div className="text-2xl">🔬</div>
                <div>
                  <div className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">Research Finding</div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">{game.scienceFact}</p>
                </div>
              </div>
            </div>

            {/* Benefits for */}
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Especially beneficial for</div>
              <div className="flex flex-wrap gap-2">
                {game.benefitsFor.map(b => (
                  <span key={b} className={`text-xs px-3 py-1 rounded-full font-medium ${game.badgeColor}`}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          to={game.path}
          className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${game.color} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95`}
        >
          Play Now <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  )
}

export default function GameHub() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-b from-brand-50 to-white py-14 px-4 sm:px-6 text-center">
        <h1 className="font-display text-5xl text-slate-900 mb-4">Brain Games</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Each game here targets a specific cognitive system. Before you play, we&apos;ll show you
          exactly <strong className="text-slate-700">which part of your brain</strong> it trains and
          <strong className="text-slate-700"> why it matters</strong> for your recovery and daily life.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium px-4 py-2 rounded-full">
          <Lightbulb size={14} />
          Click &ldquo;Why should I play this?&rdquo; on any card to see the full science
        </div>
      </div>

      {/* Game Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {GAMES.map(game => (
            <GameDetailCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  )
}
