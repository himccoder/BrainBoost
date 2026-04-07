import { Link } from 'react-router-dom'
import { Brain, Zap, TrendingUp, Shield, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react'
import { GAMES } from '../data/games'

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Understand your exercise',
    desc: 'Every game comes with a full explanation of exactly which brain region it trains and why — no jargon, just clear science.',
    icon: Brain,
    color: 'text-brand-600 bg-brand-50',
  },
  {
    step: '02',
    title: 'Play at your own pace',
    desc: 'Difficulty adapts to you. There\'s no failure here — only progress. Every attempt builds new neural pathways.',
    icon: Zap,
    color: 'text-teal-600 bg-teal-50',
  },
  {
    step: '03',
    title: 'Watch yourself grow',
    desc: 'Your dashboard tracks streaks, scores, and improvements across all cognitive domains over time.',
    icon: TrendingUp,
    color: 'text-amber-600 bg-amber-50',
  },
]

const SCIENCE_PILLARS = [
  {
    title: 'Neuroplasticity',
    desc: 'Your brain can physically rewire itself at any age. New neural connections form every time you practice a challenging cognitive task.',
    emoji: '🔬',
  },
  {
    title: 'Use It or Lose It',
    desc: 'Brain circuits that go unused weaken over time. Consistent stimulation maintains and strengthens cognitive networks that matter to you daily.',
    emoji: '💡',
  },
  {
    title: 'Dopamine & Reward',
    desc: 'Every correct answer triggers a small dopamine release — the same molecule that drives motivation and learning. Games make this process natural.',
    emoji: '⚡',
  },
  {
    title: 'Spaced Practice',
    desc: 'Short daily sessions outperform long infrequent ones. Even 10 minutes a day of focused cognitive training produces measurable results within weeks.',
    emoji: '📅',
  },
]

export default function Landing() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-brand-50/60 to-teal-50 py-20 sm:py-32">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-200 rounded-full opacity-25 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-teal-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-10 w-48 h-48 bg-violet-100 rounded-full opacity-30 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-brand-100 text-brand-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm mb-6">
            <Sparkles size={14} />
            Science-backed cognitive training
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-slate-900 leading-tight mb-6">
            Your brain can{' '}
            <span className="text-gradient">heal and grow.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            BrainBoost is a cognitive training platform designed for patients recovering from neurological conditions.
            Every game is backed by neuroscience, and every session is a real step forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/games" className="btn-primary flex items-center justify-center gap-2 text-base">
              Start Training <ChevronRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn-secondary flex items-center justify-center gap-2 text-base">
              View My Progress
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-1.5">
            <Shield size={13} />
            Free to use. No account required. Progress saved locally.
          </p>
        </div>
      </section>

      {/* Why it matters — Science Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-slate-900 mb-4">Why cognitive training works</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              This isn&apos;t just playing games. It&apos;s deliberate stimulation of the exact neural systems
              that neurological conditions affect most.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SCIENCE_PILLARS.map(({ title, desc, emoji }) => (
              <div key={title} className="card hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-slate-800 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Preview Strip */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-slate-900 mb-4">Four targeted brain workouts</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Each exercise targets a specific cognitive domain. You&apos;ll always know exactly what you&apos;re training and why.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GAMES.map(game => (
              <Link key={game.id} to={game.path} className="game-card group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:shadow-md transition-shadow`}>
                  {game.icon}
                </div>
                <div className={`inline-block text-xs font-semibold px-2 py-1 rounded-md mb-3 ${game.badgeColor}`}>
                  {game.domain}
                </div>
                <h3 className="font-semibold text-slate-800 text-base mb-1">{game.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{game.tagline}</p>
                <div className="mt-4 flex items-center text-brand-600 text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                  Learn more <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/games" className="btn-primary inline-flex items-center gap-2">
              Explore all games <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Simple, clear, and always at your pace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon, color }) => (
              <div key={step} className="relative flex flex-col items-start">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={22} />
                  </div>
                  <span className="font-display text-5xl text-slate-100 font-bold leading-none select-none">{step}</span>
                </div>
                <h3 className="font-semibold text-slate-800 text-xl mb-2">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-6">🧠</div>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-5 leading-tight">
            Every session is progress.
            <br />Every day is a win.
          </h2>
          <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            You don&apos;t need to be perfect. You just need to show up. Science shows that even 10 minutes of
            daily cognitive training produces real, measurable changes in brain function.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link to="/games" className="bg-white text-brand-700 hover:bg-brand-50 font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2">
              Begin your first session <ChevronRight size={18} />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-brand-100 text-sm">
            {['No account needed', 'Progress saved automatically', 'Fully free', '4 science-backed games'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-teal-300" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
