import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { Flame, Trophy, Brain, ChevronRight, TrendingUp, Award } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { GAMES, BADGES } from '../data/games'

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

function GameProgressCard({ game, stats }) {
  const sessions = stats.sessions || []
  const chartData = sessions.slice(-10).map((s, i) => ({
    session: i + 1,
    score: s.score,
    accuracy: s.accuracy,
  }))

  return (
    <div className={`card border ${game.cardColor}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-xl shadow-sm`}>
            {game.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">{game.title}</h3>
            <div className={`text-xs font-medium ${game.badgeColor.replace('bg-', 'text-').replace('-100', '-700').replace(' text-', ' ')} mt-0.5`}>
              {game.domain}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-slate-800">{stats.bestScore}</div>
          <div className="text-xs text-slate-400">Best score</div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-slate-400 text-sm mb-3">No sessions yet</p>
          <Link to={game.path} className={`text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r ${game.color} text-white`}>
            Play now
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>{stats.timesPlayed} sessions played</span>
            <span>Last 10 shown</span>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                formatter={v => [v, 'Score']}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 flex justify-end">
            <Link to={game.path} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              Play again <ChevronRight size={12} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

function BadgeItem({ badgeId, earned }) {
  const badge = BADGES[badgeId]
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      earned ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
    }`}>
      <div className="text-2xl">{badge.icon}</div>
      <div>
        <div className="font-semibold text-slate-800 text-sm">{badge.label}</div>
        <div className="text-slate-400 text-xs">{badge.desc}</div>
      </div>
      {earned && <div className="ml-auto text-emerald-500 text-xs font-medium">Earned ✓</div>}
    </div>
  )
}

export default function Dashboard() {
  const { progress, resetProgress } = useProgress()
  const { streak, totalSessionsPlayed, badges, games } = progress

  const totalBestScore = Object.values(games).reduce((sum, g) => sum + g.bestScore, 0)
  const totalGamesPlayed = Object.values(games).filter(g => g.timesPlayed > 0).length

  // Radar chart data for cognitive domains
  const radarData = GAMES.map(game => {
    const stats = games[game.id]
    const avgScore = stats.sessions.length > 0
      ? Math.round(stats.sessions.slice(-5).reduce((s, r) => s + r.score, 0) / Math.min(stats.sessions.length, 5))
      : 0
    return { domain: game.domain.split(' ')[0], score: avgScore }
  })

  const hasAnyData = totalSessionsPlayed > 0

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-b from-brand-50 to-white py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-4xl text-slate-900 mb-2">My Progress</h1>
          <p className="text-slate-500">Track your cognitive training journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {!hasAnyData ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-100 to-teal-100 flex items-center justify-center text-5xl shadow-sm">
              🧠
            </div>
            <h2 className="font-display text-3xl text-slate-800 mb-3">Your journey starts here</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              Play your first game to start tracking your cognitive progress. Every session will appear here as a chart.
            </p>
            <Link to="/games" className="btn-primary inline-flex items-center gap-2">
              Go to Brain Games <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Day Streak"
                value={streak}
                sub={streak >= 3 ? 'Amazing consistency! 🔥' : 'Play daily to build your streak'}
                icon={Flame}
                color="bg-gradient-to-br from-orange-400 to-rose-500"
              />
              <StatCard
                label="Total Sessions"
                value={totalSessionsPlayed}
                sub="Every session matters"
                icon={Brain}
                color="bg-gradient-to-br from-brand-500 to-violet-600"
              />
              <StatCard
                label="Games Explored"
                value={`${totalGamesPlayed} / 4`}
                sub="Try all 4 domains"
                icon={TrendingUp}
                color="bg-gradient-to-br from-teal-500 to-emerald-600"
              />
              <StatCard
                label="Badges Earned"
                value={`${badges.length} / ${Object.keys(BADGES).length}`}
                sub="Keep going for more"
                icon={Trophy}
                color="bg-gradient-to-br from-amber-400 to-orange-500"
              />
            </div>

            {/* Motivational banner */}
            <div className="bg-gradient-to-r from-brand-600 to-teal-600 rounded-2xl p-5 mb-8 text-white flex items-center gap-4">
              <div className="text-4xl">🧠</div>
              <div>
                <div className="font-semibold text-lg">
                  {streak >= 7 ? 'A full week! Your brain is thriving.' :
                   streak >= 3 ? `${streak}-day streak — neuroplasticity is happening right now.` :
                   totalSessionsPlayed >= 5 ? 'You\'re building real cognitive resilience.' :
                   'Great start. Consistency is the key to brain health.'}
                </div>
                <div className="text-white/70 text-sm mt-0.5">
                  Science says: regular practice strengthens synaptic connections and can visibly change brain structure.
                </div>
              </div>
            </div>

            {/* Radar chart + game cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-500" />
                  Cognitive Domain Overview
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip formatter={v => [`${v}%`, 'Avg Score']} />
                  </RadarChart>
                </ResponsiveContainer>
                <p className="text-xs text-slate-400 text-center mt-2">Average score per cognitive domain</p>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GAMES.map(g => (
                  <GameProgressCard key={g.id} game={g} stats={games[g.id]} />
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="card">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Award size={16} className="text-amber-500" />
                Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.keys(BADGES).map(id => (
                  <BadgeItem key={id} badgeId={id} earned={badges.includes(id)} />
                ))}
              </div>
            </div>

            {/* Reset */}
            <div className="text-center mt-8">
              <button
                onClick={() => { if (window.confirm('Reset all progress? This cannot be undone.')) resetProgress() }}
                className="text-slate-400 hover:text-rose-500 text-xs underline underline-offset-2 transition-colors"
              >
                Reset all progress
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
