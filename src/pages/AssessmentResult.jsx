import { useLocation, useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Brain, ChevronRight, Download, RotateCcw, TrendingUp, AlertCircle, Clock, Info, ChevronDown, User } from 'lucide-react'
import { DOMAINS, scoreBand, SCORING_EXPLANATIONS } from '../data/assessment'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function calcAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age >= 0 ? age : null
}

const GENDER_LABEL = { male: 'Male', female: 'Female', prefer_not_to_say: 'Not disclosed' }

const DOMAIN_ORDER = ['memory', 'attention', 'workingMem', 'reasoning', 'processing']

const DOMAIN_ADVICE = {
  memory:     { strong: 'Your memory is performing well. Keep practising with Memory Card Match to maintain hippocampal encoding strength.', weak: 'Memory was the most challenging domain. Daily Memory Card Match sessions — even short ones — meaningfully strengthen hippocampal pathways over weeks.' },
  attention:  { strong: 'Focused attention is a strength. The Stroop game keeps your prefrontal inhibitory circuits sharp.', weak: 'Attention and inhibitory control showed room for growth. Regular Stroop practice rebuilds the prefrontal networks that filter distractions.' },
  workingMem: { strong: 'Your working memory is holding up well — this is crucial for following conversations and daily plans.', weak: 'Working memory could benefit from Sequence Recall practice. This directly trains the prefrontal-parietal circuit that keeps information active in mind.' },
  reasoning:  { strong: 'Abstract reasoning is a strong suit. Pattern Recognition games will help maintain this parietal-frontal network.', weak: 'Fluid reasoning showed the most room for improvement. Pattern Recognition exercises rebuild the network responsible for logical problem-solving.' },
  processing: { strong: 'Processing speed is good — quick, consistent reactions indicate efficient neural transmission.', weak: 'Processing speed was below average. This is trainable: consistent daily practice gradually speeds up neural pathways.' },
}

function fmtMs(ms)  { if (!ms && ms !== 0) return '—'; return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms/1000).toFixed(1)} s` }
function fmtSec(ms) { if (!ms) return '—'; const s = Math.round(ms/1000); const m = Math.floor(s/60); return m > 0 ? `${m}m ${s%60}s` : `${s}s` }

function PatientHeader({ profile, completedAt, type }) {
  if (!profile) return null
  const age    = calcAge(profile.date_of_birth)
  const gender = GENDER_LABEL[profile.gender] || null
  const hasExtra = age !== null || gender

  return (
    <div className="card mb-6 print:mb-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white font-bold text-base shrink-0">
          {(profile.name || '?')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 text-base leading-tight">
            {profile.name || <span className="text-slate-400 italic">Name not set</span>}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
            {hasExtra && (
              <span className="text-xs text-slate-500">
                {[age != null && `Age ${age}`, gender].filter(Boolean).join(' · ')}
              </span>
            )}
            {completedAt && (
              <span className="text-xs text-slate-400">
                {new Date(completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${type === 'onboarding' ? 'bg-brand-50 text-brand-600' : 'bg-teal-50 text-teal-600'}`}>
              {type === 'onboarding' ? 'Onboarding' : 'Biweekly'} Assessment
            </span>
          </div>
        </div>
        {(!profile.date_of_birth || !profile.gender) && (
          <a href="/profile"
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold shrink-0 flex items-center gap-1 print:hidden">
            <User size={11} /> Complete profile
          </a>
        )}
      </div>
    </div>
  )
}

function DomainBar({ domain, score }) {
  const d     = DOMAINS[domain]
  const pct   = score ?? 0
  const level = pct >= 75 ? 'Strong' : pct >= 50 ? 'Average' : 'Needs work'
  const lc    = pct >= 75 ? 'text-teal-600' : pct >= 50 ? 'text-blue-600' : 'text-violet-600'
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <div>
          <span className="text-sm font-semibold text-slate-700">{d.label}</span>
          <span className="text-xs text-slate-400 ml-2 hidden sm:inline">{d.region}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${lc}`}>{level}</span>
          <span className="text-lg font-bold text-slate-800 tabular-nums w-10 text-right">{pct}</span>
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${d.color} transition-all duration-700`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function TimingPill({ label, value, color = 'bg-slate-100 text-slate-600' }) {
  if (!value) return null
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
      <Clock size={11} />
      <span>{label}: {value}</span>
    </div>
  )
}

function ScoringAccordion({ scores }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card mb-6 print:hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-brand-500 shrink-0" />
          <span className="font-semibold text-slate-700 text-sm">How these scores are calculated</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-5 space-y-4 animate-slide-up">
          <p className="text-slate-500 text-xs leading-relaxed">
            Each domain uses a scoring formula derived from a validated neuropsychological instrument.
            Both <strong className="text-slate-700">accuracy</strong> and <strong className="text-slate-700">response time</strong> are considered where clinically relevant.
          </p>
          {DOMAIN_ORDER.map(k => {
            const d  = DOMAINS[k]
            const ex = SCORING_EXPLANATIONS[k]
            return (
              <div key={k} className={`rounded-2xl p-4 border ${d.bg} ${d.border}`}>
                <div className={`font-semibold text-xs uppercase tracking-wide mb-1 ${d.text}`}>{d.label}</div>
                <div className="text-slate-700 text-sm font-mono mb-2 bg-white/70 rounded-lg px-3 py-1.5 inline-block">{ex.formula}</div>
                <p className="text-slate-500 text-xs leading-relaxed">{ex.clinical}</p>
                {scores[k] != null && (
                  <div className={`mt-2 text-xs font-bold ${d.text}`}>Your score: {scores[k]} / 100</div>
                )}
              </div>
            )
          })}
          <p className="text-slate-400 text-xs">
            Overall score = weighted mean (Memory 25 % · Working Memory 25 % · Attention 20 % · Reasoning 20 % · Processing Speed 10 %).
            Weights reflect the relative clinical importance of each domain in cognitive ageing research.
          </p>
        </div>
      )}
    </div>
  )
}

function TaskTimingCard({ taskResults }) {
  if (!taskResults) return null
  const rows = [
    { key: 'symbol_memory',    label: 'Symbol Recognition',   icon: '🧠', timing: taskResults.symbol_memory    ? `Recall: ${fmtMs(taskResults.symbol_memory.recallMs)} · Total: ${fmtSec(taskResults.symbol_memory.totalMs)}` : null },
    { key: 'stroop_attention', label: 'Colour-Word Attention', icon: '🎨', timing: taskResults.stroop_attention  ? `Median RT: ${fmtMs(taskResults.stroop_attention.medianRtMs)} · Total: ${fmtSec(taskResults.stroop_attention.totalMs)}` : null },
    { key: 'digit_span',       label: 'Sequence Span',         icon: '🔢', timing: taskResults.digit_span        ? `Best span: ${taskResults.digit_span.bestLevel} tiles · Total: ${fmtSec(taskResults.digit_span.totalMs)}` : null },
    { key: 'matrix_reasoning', label: 'Matrix Reasoning',      icon: '◆',  timing: taskResults.matrix_reasoning  ? `Avg per Q: ${fmtMs(taskResults.matrix_reasoning.avgRtMs)} · Total: ${fmtSec(taskResults.matrix_reasoning.totalMs)}` : null },
    { key: 'reaction_time',    label: 'Reaction Speed',        icon: '⚡',  timing: taskResults.reaction_time     ? `Median RT: ${fmtMs(taskResults.reaction_time.medianRtMs)} · ${taskResults.reaction_time.times?.length ?? 0} trials` : null },
  ]
  const validRows = rows.filter(r => r.timing)
  if (validRows.length === 0) return null

  return (
    <div className="card mb-6">
      <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2 mb-4">
        <Clock size={15} className="text-brand-500" /> Response-Time Breakdown
      </h3>
      <div className="space-y-2.5">
        {validRows.map(r => (
          <div key={r.key} className="flex items-center justify-between gap-3 py-2 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-2">
              <span className="text-base">{r.icon}</span>
              <span className="text-sm text-slate-600 font-medium">{r.label}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono text-right shrink-0">{r.timing}</span>
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-xs mt-3 leading-relaxed">
        Response times are clinical indicators. Median RT is used (not mean) to reduce the impact of individual slow reactions.
        Consistently fast responses across trials suggest efficient neural processing.
      </p>
    </div>
  )
}

export default function AssessmentResult() {
  const { id }      = useParams()
  const { state }   = useLocation()
  const { user, profile } = useAuth()
  const [data, setData]     = useState(state || null)
  const [rawRow, setRawRow] = useState(null)
  const [loading, setLoading] = useState(!state)

  useEffect(() => {
    if (state || !user || id === 'local') { setLoading(false); return }
    supabase.from('assessments').select('*').eq('id', id).single()
      .then(({ data: row }) => {
        if (row) {
          setRawRow(row)
          setData({
            scores: {
              memory:     row.score_memory,
              attention:  row.score_attention,
              workingMem: row.score_working_mem,
              reasoning:  row.score_reasoning,
              processing: row.score_processing,
            },
            overall: row.overall_score,
            type: row.type,
            completedAt: row.completed_at,
            taskResults: row.task_results,
            totalMs: row.task_results?._meta?.totalMs,
          })
        }
        setLoading(false)
      })
  }, [id, user, state])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
    </div>
  )
  if (!data) return (
    <div className="min-h-screen flex items-center justify-center text-slate-400">Assessment not found.</div>
  )

  const { scores, overall, type, completedAt, taskResults, totalMs } = data
  const band      = scoreBand(overall)
  const radarData = DOMAIN_ORDER.map(k => ({ domain: DOMAINS[k].label.split(' ')[0], score: scores[k] ?? 0 }))
  const weakest   = DOMAIN_ORDER.filter(k => scores[k] != null).sort((a, b) => (scores[a] ?? 0) - (scores[b] ?? 0))[0]
  const strongest = DOMAIN_ORDER.filter(k => scores[k] != null).sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/30 to-white print:bg-white">
      {/* Print header */}
      <div className="hidden print:block py-6 border-b border-slate-200 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-display text-2xl text-slate-900 mb-1">BrainBoost — Cognitive Assessment Report</div>
            <div className="text-slate-500 text-sm">
              {type === 'onboarding' ? 'Onboarding' : 'Biweekly'} Assessment
              {completedAt && ` · ${new Date(completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {totalMs && ` · Duration: ${fmtSec(totalMs)}`}
            </div>
          </div>
          {profile && (
            <div className="text-right text-sm">
              <div className="font-semibold text-slate-800">{profile.name || '—'}</div>
              <div className="text-slate-500">
                {[calcAge(profile.date_of_birth) != null && `Age ${calcAge(profile.date_of_birth)}`, GENDER_LABEL[profile.gender]].filter(Boolean).join(' · ') || '—'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav bar */}
      <div className="print:hidden sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium">
            <Brain size={16} className="text-brand-500" /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <Download size={13} /> Save / Print
            </button>
            <Link to="/assessment?type=biweekly"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 transition-colors">
              <RotateCcw size={13} /> Retake
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Patient identity card */}
        <PatientHeader profile={profile} completedAt={completedAt} type={type} />

        {/* Hero score */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex flex-col items-center">
            <div className={`w-28 h-28 rounded-full border-4 ${band.border} ${band.bg} flex flex-col items-center justify-center mb-4 shadow-md`}>
              <span className={`text-4xl font-bold ${band.color}`}>{overall}</span>
              <span className="text-xs text-slate-400 font-medium">/100</span>
            </div>
            <h1 className="font-display text-3xl text-slate-900 mb-1">Cognitive Profile</h1>
            <div className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full border mb-2 ${band.color} ${band.bg} ${band.border}`}>
              {band.label}
            </div>
            <p className="text-slate-500 text-sm max-w-sm text-center leading-relaxed mb-2">{band.desc}</p>
            {totalMs && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Clock size={12} /> Assessment completed in {fmtSec(totalMs)}
                {completedAt && ` · ${new Date(completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </div>
            )}
          </div>
        </div>

        {/* Radar + domain bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-brand-500" /> Domain Overview
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.18} strokeWidth={2} />
                <Tooltip formatter={v => [`${v}`, 'Score']} contentStyle={{ fontSize: 11, borderRadius: 10, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="font-semibold text-slate-700 text-sm mb-5 flex items-center gap-2">
              <Brain size={15} className="text-brand-500" /> Domain Scores
            </h3>
            {DOMAIN_ORDER.map(k => <DomainBar key={k} domain={k} score={scores[k]} />)}
          </div>
        </div>

        {/* Response-time detail */}
        <TaskTimingCard taskResults={taskResults} />

        {/* Scoring explanation (collapsible) */}
        <ScoringAccordion scores={scores} />

        {/* Recommendations */}
        <div className="card mb-6">
          <h3 className="font-semibold text-slate-800 mb-5">Personalised Recommendations</h3>
          <div className="space-y-3">
            {weakest && (
              <div className={`rounded-2xl p-4 border ${DOMAINS[weakest].bg} ${DOMAINS[weakest].border}`}>
                <div className={`flex items-center gap-2 text-sm font-bold mb-1 ${DOMAINS[weakest].text}`}>
                  <AlertCircle size={13} /> Priority: {DOMAINS[weakest].label}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{DOMAIN_ADVICE[weakest].weak}</p>
              </div>
            )}
            {strongest && strongest !== weakest && (
              <div className="rounded-2xl p-4 bg-teal-50 border border-teal-100">
                <div className="flex items-center gap-2 text-sm font-bold text-teal-700 mb-1">
                  ✓ Strength: {DOMAINS[strongest].label}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{DOMAIN_ADVICE[strongest].strong}</p>
              </div>
            )}
            <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100">
              <div className="text-sm font-bold text-slate-700 mb-1">📅 Next Steps</div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Aim for <strong className="text-slate-700">10–15 minutes of daily practice</strong>. Your next assessment is recommended in <strong className="text-slate-700">2 weeks</strong>. Consistent biweekly assessments let your care team track cognitive trends over time.
              </p>
            </div>
          </div>
        </div>

        {/* Clinician note */}
        <div className="card mb-8 bg-brand-50/40 border-brand-100 print:bg-white print:border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
              <Download size={14} className="text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm mb-1">For your neurologist or care team</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Use <strong>Save / Print</strong> to generate a PDF. The domain scores, radar chart, response-time data, and scoring methodology are formatted for clinical review. Longitudinal biweekly data provides trend analysis across five neuropsychologically validated domains.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <Link to="/games" className="btn-primary flex-1 flex items-center justify-center gap-2">
            Start Training <ChevronRight size={17} />
          </Link>
          <Link to="/dashboard" className="btn-secondary flex-1 flex items-center justify-center gap-2">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
