import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Brain, ChevronRight, Clock, Loader2, ArrowLeft, X } from 'lucide-react'
import {
  TASKS, DOMAINS, SYMBOLS, calcOverallScore,
  scoreMemory, scoreAttention, scoreWorkingMem, scoreReasoning, scoreProcessing,
} from '../data/assessment'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { sounds } from '../lib/sounds'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }
function median(arr)  { const s = [...arr].sort((a,b)=>a-b); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2 }
function fmtMs(ms)    { return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms/1000).toFixed(1)} s` }

const STROOP_COLORS = [
  { name: 'Red', css: '#ef4444' }, { name: 'Blue', css: '#3b82f6' },
  { name: 'Green', css: '#22c55e' }, { name: 'Yellow', css: '#eab308' },
  { name: 'Purple', css: '#a855f7' },
]
function makeStroopRound() {
  const word = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)]
  let ink  = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)]
  if (Math.random() > 0.35) while (ink.name === word.name) ink = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)]
  return { word, ink }
}

function makePatternQ() {
  const type = ['color', 'shape', 'number'][Math.floor(Math.random() * 3)]
  if (type === 'number') {
    const step  = [2, 3, 4, 5][Math.floor(Math.random() * 4)]
    const start = Math.floor(Math.random() * 5) + 1
    const seq   = Array.from({ length: 4 }, (_, i) => start + i * step)
    const ans   = start + 4 * step
    const opts  = shuffle([ans, ans + 1, ans - step, ans + step].filter((v,i,a)=>a.indexOf(v)===i)).slice(0,4)
    if (!opts.includes(ans)) opts[0] = ans
    return { type, seq, ans, opts: shuffle(opts) }
  }
  if (type === 'color') {
    const COLS = ['#6366f1','#14b8a6','#f59e0b','#ef4444','#8b5cf6','#10b981']
    const seq = Array.from({ length: 4 }, (_,i) => COLS[i%3]); const ans = COLS[4%3]
    return { type, seq, ans, opts: shuffle([ans, ...COLS.filter(c=>c!==ans).slice(0,3)]) }
  }
  const SHAPES = ['●','■','▲','◆','★','✿']
  const seq = Array.from({ length: 4 }, (_,i) => SHAPES[i%3]); const ans = SHAPES[4%3]
  return { type, seq, ans, opts: shuffle([ans, ...SHAPES.filter(s=>s!==ans).slice(0,3)]) }
}

// ─── Exit confirmation dialog ─────────────────────────────────────────────────

function ExitDialog({ onStay, onExit }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 animate-pop">
        <div className="text-3xl mb-3 text-center">⚠️</div>
        <h3 className="font-display text-xl text-slate-900 text-center mb-2">Leave assessment?</h3>
        <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed">
          Your progress in this session will be lost. You can start again from the dashboard.
        </p>
        <div className="flex gap-3">
          <button onClick={onStay}
            className="flex-1 py-3 rounded-xl font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors">
            Keep going
          </button>
          <button onClick={onExit}
            className="flex-1 py-3 rounded-xl font-semibold border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 transition-colors">
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Task 1: Symbol Recognition ───────────────────────────────────────────────

function TaskSymbolMemory({ onComplete }) {
  const targets   = useRef(shuffle(SYMBOLS).slice(0, 4))
  const foils     = useRef(shuffle(SYMBOLS.filter(s => !targets.current.includes(s))).slice(0, 4))
  const options   = useRef(shuffle([...targets.current, ...foils.current]))
  const recallStart = useRef(null)
  const taskStart = useRef(Date.now())
  const [phase, setPhase]   = useState('study')
  const [timeLeft, setLeft] = useState(12)
  const [selected, setSelected] = useState(new Set())
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (phase !== 'study') return
    const t = setInterval(() => setLeft(n => {
      if (n <= 1) { clearInterval(t); setPhase('recall'); recallStart.current = Date.now(); return 0 }
      return n - 1
    }), 1000)
    return () => clearInterval(t)
  }, [phase])

  function toggle(s) {
    if (submitted) return
    setSelected(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n })
  }

  function submit() {
    setSubmitted(true)
    let hits = 0, falseAlarms = 0
    selected.forEach(s => { if (targets.current.includes(s)) hits++; else falseAlarms++ })
    const recallMs   = Date.now() - (recallStart.current || Date.now())
    const totalMs    = Date.now() - taskStart.current
    const score      = scoreMemory({ hits, falseAlarms, targets: targets.current.length, foils: foils.current.length })
    setTimeout(() => onComplete({
      hits, falseAlarms, score,
      recallMs, totalMs,
      targets: targets.current, selected: [...selected],
    }), 900)
  }

  return (
    <div className="max-w-lg mx-auto animate-slide-up">
      {phase === 'study' ? (
        <div className="card text-center">
          <div className="flex items-center justify-center gap-2 text-brand-600 text-sm font-semibold mb-4">
            <Clock size={14} /> Memorise these symbols — {timeLeft}s
          </div>
          <div className="h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 12) * 100}%` }} />
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {targets.current.map((s, i) => (
              <div key={i} className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl text-indigo-600">
                {s}
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-4">They will disappear — remember as many as you can.</p>
        </div>
      ) : (
        <div className="card">
          <h3 className="font-semibold text-slate-800 text-center mb-1">Which symbols did you see?</h3>
          <p className="text-slate-400 text-xs text-center mb-6">Select all that appeared.</p>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {options.current.map((s, i) => (
              <button key={i} onClick={() => toggle(s)}
                className={`h-14 rounded-xl text-2xl font-bold border-2 transition-all ${
                  submitted
                    ? targets.current.includes(s) ? 'bg-teal-100 border-teal-400 text-teal-700 scale-105'
                      : selected.has(s) ? 'bg-red-100 border-red-300 text-red-600'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                    : selected.has(s) ? 'bg-indigo-100 border-indigo-400 text-indigo-700 scale-105'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
                }`}>{s}</button>
            ))}
          </div>
          {!submitted
            ? <button onClick={submit} disabled={selected.size === 0}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Answer
              </button>
            : <p className="text-center text-sm text-slate-400 animate-fade-in">Scoring… moving on shortly</p>
          }
        </div>
      )}
    </div>
  )
}

// ─── Task 2: Stroop Attention ─────────────────────────────────────────────────

function TaskStroopAttention({ onComplete }) {
  const TOTAL = 12
  const taskStart   = useRef(Date.now())
  const roundStart  = useRef(null)
  const trialRTs    = useRef([])

  const [round, setRound]       = useState(() => makeStroopRound())
  const [roundNum, setNum]      = useState(0)
  const [correct, setCorrect]   = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [timeLeft, setLeft]     = useState(3)
  const timer = useRef(null)

  // Start timing when the component mounts (first round appears)
  useEffect(() => { roundStart.current = Date.now() }, [])

  const advance = useCallback((c, rts) => {
    clearInterval(timer.current)
    const next = roundNum + 1
    if (next >= TOTAL) {
      const totalMs = Date.now() - taskStart.current
      const score   = scoreAttention({ correct: c, total: TOTAL, trialRTs: rts })
      const medRT   = rts.length > 0 ? Math.round(median(rts)) : null
      setTimeout(() => onComplete({ correct: c, total: TOTAL, score, medianRtMs: medRT, trialRTs: rts, totalMs }), 700)
      return
    }
    setTimeout(() => {
      setRound(makeStroopRound()); setNum(next); setFeedback(null); setLeft(3)
      roundStart.current = Date.now()
    }, 700)
  }, [roundNum, onComplete])

  useEffect(() => {
    timer.current = setInterval(() => setLeft(n => {
      if (n <= 1) { sounds.wrong(); setFeedback('timeout'); advance(correct, trialRTs.current); return 0 }
      return n - 1
    }), 1000)
    return () => clearInterval(timer.current)
  }, [round, advance, correct])

  function answer(name) {
    clearInterval(timer.current)
    const rt = Date.now() - (roundStart.current || Date.now())
    const ok = name === round.ink.name
    if (ok) { sounds.correct(); trialRTs.current = [...trialRTs.current, rt] } else sounds.wrong()
    setFeedback(ok ? 'correct' : 'wrong')
    const nc = ok ? correct + 1 : correct
    setCorrect(nc)
    advance(nc, trialRTs.current)
  }

  return (
    <div className="max-w-lg mx-auto animate-slide-up">
      <div className="flex justify-between text-sm text-slate-500 mb-3">
        <span>Round {roundNum + 1} of {TOTAL}</span>
        <span className={`font-bold ${timeLeft <= 1 ? 'text-red-400' : 'text-slate-600'}`}>{timeLeft}s</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000"
          style={{ width: `${(timeLeft / 3) * 100}%` }} />
      </div>
      <div className={`card text-center mb-5 transition-colors ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-100' : feedback ? 'bg-red-50 border-red-100' : ''}`}>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-4">What colour is the INK?</p>
        <p className="text-7xl font-black mb-3 leading-none" style={{ color: round.ink.css }}>{round.word.name}</p>
        {feedback && <p className={`text-sm font-semibold ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
          {feedback === 'correct' ? '✓ Correct' : `✗ It was ${round.ink.name}`}
        </p>}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {STROOP_COLORS.map(c => (
          <button key={c.name} onClick={() => !feedback && answer(c.name)} disabled={!!feedback}
            className="py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: c.css }}>{c.name}</button>
        ))}
      </div>
    </div>
  )
}

// ─── Task 3: Sequence Span ────────────────────────────────────────────────────

const GRID = Array.from({ length: 9 }, (_, i) => i)

function TaskDigitSpan({ onComplete }) {
  const taskStart = useRef(Date.now())
  const [level, setLevel]     = useState(3)
  const [seq, setSeq]         = useState([])
  const [playerSeq, setPlayer] = useState([])
  const [phase, setPhase]     = useState('ready')
  const [active, setActive]   = useState(null)
  const [errors, setErrors]   = useState(0)
  const [bestLevel, setBest]  = useState(3)
  const MAX_ERRORS = 3

  const showSeq = useCallback((s) => {
    setPhase('showing'); setPlayer([])
    let i = 0
    const iv = setInterval(() => {
      sounds.tileShow(); setActive(s[i])
      setTimeout(() => setActive(null), 450)
      i++
      if (i >= s.length) { clearInterval(iv); setTimeout(() => setPhase('input'), 700) }
    }, 800)
  }, [])

  useEffect(() => {
    const s = Array.from({ length: level }, () => Math.floor(Math.random() * 9))
    setSeq(s); showSeq(s)
  }, [level, showSeq])

  function tap(id) {
    if (phase !== 'input') return
    sounds.tileTap()
    const np = [...playerSeq, id]
    setPlayer(np)
    if (id !== seq[np.length - 1]) {
      sounds.wrong()
      const ne = errors + 1
      setErrors(ne)
      if (ne >= MAX_ERRORS) {
        const totalMs = Date.now() - taskStart.current
        const score   = scoreWorkingMem({ bestLevel, errorsUsed: ne })
        setTimeout(() => onComplete({ bestLevel, errors: ne, score, totalMs }), 600)
      } else {
        setPhase('wrong')
        setTimeout(() => {
          const s = Array.from({ length: level }, () => Math.floor(Math.random() * 9))
          setSeq(s); showSeq(s)
        }, 1000)
      }
      return
    }
    if (np.length === seq.length) {
      sounds.levelUp()
      const nl = level + 1; setBest(Math.max(bestLevel, nl))
      setLevel(nl); setPhase('correct')
    }
  }

  return (
    <div className="max-w-sm mx-auto animate-slide-up">
      <div className="flex justify-between items-center mb-5">
        <div className="card !p-3 text-center min-w-[72px]">
          <div className="text-xl font-bold text-blue-500">{level}</div>
          <div className="text-xs text-slate-400">Length</div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
          phase === 'showing' ? 'bg-indigo-50 text-indigo-700' :
          phase === 'input'   ? 'bg-blue-50 text-blue-700' :
          phase === 'correct' ? 'bg-teal-50 text-teal-700' :
          phase === 'wrong'   ? 'bg-red-50 text-red-500'  : 'bg-slate-100 text-slate-600'
        }`}>
          {phase === 'showing' ? '👁 Watch…' : phase === 'input' ? '👆 Your turn!' :
           phase === 'correct' ? '✓ Next level!' : '✗ Try again…'}
        </div>
        <div className="card !p-3 text-center min-w-[72px]">
          <div className="text-xl">{'❤️'.repeat(MAX_ERRORS - errors)}</div>
          <div className="text-xs text-slate-400">Lives</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {GRID.map(id => (
          <button key={id} onClick={() => tap(id)}
            className={`aspect-square rounded-2xl text-white font-bold text-xl border-2 transition-all shadow-sm
              ${active === id ? 'bg-blue-300 border-blue-400 scale-110 shadow-lg' :
                phase === 'input' ? 'bg-blue-500 border-blue-600 hover:bg-blue-400 hover:scale-105 cursor-pointer' :
                'bg-blue-500 border-blue-600 opacity-75 cursor-default'}`}
          >{id + 1}</button>
        ))}
      </div>
      <div className="flex justify-center gap-1.5">
        {seq.map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i < playerSeq.length ? 'bg-blue-400 scale-110' : 'bg-slate-200'}`} />
        ))}
      </div>
    </div>
  )
}

// ─── Task 4: Matrix Reasoning ─────────────────────────────────────────────────

function PItem({ q, v, sm }) {
  const sz = sm ? 'w-9 h-9 text-lg' : 'w-12 h-12 text-2xl'
  if (q.type === 'color') return <div className={`${sz} rounded-xl`} style={{ background: v }} />
  if (q.type === 'shape') return <div className={`${sz} rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold`}>{v}</div>
  return <div className={`${sz} rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold ${sm ? 'text-sm' : 'text-xl'}`}>{v}</div>
}

function TaskMatrixReasoning({ onComplete }) {
  const TOTAL     = 8
  const taskStart = useRef(Date.now())
  const qStart    = useRef(Date.now())
  const trialRTs  = useRef([])
  const [qs]      = useState(() => Array.from({ length: TOTAL }, makePatternQ))
  const [idx, setIdx]       = useState(0)
  const [correct, setC]     = useState(0)
  const [feedback, setFb]   = useState(null)
  const [selected, setSel]  = useState(null)

  // Reset per-question timer when idx changes
  useEffect(() => { qStart.current = Date.now() }, [idx])

  function answer(opt) {
    if (feedback) return
    const rt = Date.now() - qStart.current
    const ok = String(opt) === String(qs[idx].ans)
    if (ok) sounds.correct(); else sounds.wrong()
    trialRTs.current = [...trialRTs.current, rt]
    setSel(opt); setFb(ok ? 'correct' : 'wrong')
    const nc = ok ? correct + 1 : correct
    setTimeout(() => {
      const ni = idx + 1
      if (ni >= TOTAL) {
        const totalMs = Date.now() - taskStart.current
        const score   = scoreReasoning({ correct: nc, total: TOTAL, trialRTs: trialRTs.current })
        const avgRT   = trialRTs.current.length > 0
          ? Math.round(trialRTs.current.reduce((a,b)=>a+b,0) / trialRTs.current.length)
          : null
        onComplete({ correct: nc, total: TOTAL, score, avgRtMs: avgRT, trialRTs: trialRTs.current, totalMs })
        return
      }
      setIdx(ni); setFb(null); setSel(null); setC(nc)
    }, 900)
  }

  const q = qs[idx]
  return (
    <div className="max-w-lg mx-auto animate-slide-up">
      <div className="flex justify-between text-sm text-slate-500 mb-3">
        <span>Question {idx + 1} of {TOTAL}</span>
        <span className="text-teal-600 font-semibold">{correct} correct</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all"
          style={{ width: `${(idx / TOTAL) * 100}%` }} />
      </div>
      <div className={`card mb-5 transition-colors ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-100' : feedback ? 'bg-red-50 border-red-100' : ''}`}>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-center mb-5">What comes next?</p>
        <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
          {q.seq.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <PItem q={q} v={v} />
              <span className="text-slate-300 text-lg">→</span>
            </div>
          ))}
          <div className="w-12 h-12 rounded-xl border-2 border-dashed border-teal-400 bg-teal-50 flex items-center justify-center text-teal-400 font-bold text-xl">?</div>
        </div>
        {feedback && <p className={`text-center text-sm font-semibold ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
          {feedback === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
        </p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => answer(opt)} disabled={!!feedback}
            className={`py-4 rounded-xl font-semibold border-2 flex items-center justify-center gap-2 transition-all
              ${selected != null && String(selected) === String(opt)
                ? feedback === 'correct' ? 'bg-emerald-100 border-emerald-400' : 'bg-red-100 border-red-300'
                : String(opt) === String(q.ans) && feedback === 'wrong' ? 'bg-emerald-100 border-emerald-400'
                : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-teal-50 hover:scale-105'
              } disabled:cursor-not-allowed`}>
            <PItem q={q} v={opt} sm />
            {q.type === 'number' && <span className="text-slate-700">{opt}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Task 5: Reaction Speed ───────────────────────────────────────────────────

function TaskReactionTime({ onComplete }) {
  const TOTAL   = 10
  const taskStart = useRef(Date.now())
  const shownAt = useRef(null)
  const [trial, setTrial]     = useState(0)
  const [dotPos, setDotPos]   = useState(null)
  const [waiting, setWaiting] = useState(true)
  const [times, setTimes]     = useState([])

  useEffect(() => {
    const delay = 1200 + Math.random() * 2000
    const t = setTimeout(() => {
      setDotPos({ top: 15 + Math.random() * 65, left: 10 + Math.random() * 75 })
      setWaiting(false); shownAt.current = Date.now()
    }, delay)
    return () => clearTimeout(t)
  }, [trial])

  function hit() {
    if (waiting || dotPos === null) return
    sounds.correct()
    const rt       = Date.now() - shownAt.current
    const newTimes = [...times, rt]
    setTimes(newTimes); setDotPos(null); setWaiting(true)
    const next = trial + 1
    if (next >= TOTAL) {
      const totalMs = Date.now() - taskStart.current
      const med     = Math.round(median(newTimes))
      const score   = scoreProcessing({ times: newTimes })
      setTimeout(() => onComplete({
        times: newTimes, medianRtMs: med, avgMs: Math.round(newTimes.reduce((a,b)=>a+b,0)/newTimes.length),
        score, totalMs,
      }), 500)
      return
    }
    setTrial(next)
  }

  const med = times.length > 0 ? Math.round(median(times)) : null
  return (
    <div className="animate-slide-up">
      <div className="flex justify-between text-sm text-slate-500 mb-3">
        <span>Trial {trial + 1} of {TOTAL}</span>
        {med && <span className="text-violet-600 font-semibold">Median {fmtMs(med)}</span>}
      </div>
      <div className="h-2 bg-slate-100 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all"
          style={{ width: `${(trial / TOTAL) * 100}%` }} />
      </div>
      <div onClick={hit}
        className="relative bg-gradient-to-br from-slate-50 to-brand-50 border border-slate-100 rounded-3xl cursor-crosshair select-none"
        style={{ height: 320 }}>
        {waiting
          ? <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-300 text-sm font-medium">Get ready…</p>
            </div>
          : dotPos && (
            <div onClick={hit}
              className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg animate-pop cursor-pointer"
              style={{ top: `${dotPos.top}%`, left: `${dotPos.left}%`, transform: 'translate(-50%,-50%)' }} />
          )}
      </div>
      <p className="text-center text-xs text-slate-400 mt-3">Tap the circle the moment it appears</p>
    </div>
  )
}

// ─── Assessment Shell ─────────────────────────────────────────────────────────

const TASK_COMPONENTS = {
  symbol_memory:    TaskSymbolMemory,
  stroop_attention: TaskStroopAttention,
  digit_span:       TaskDigitSpan,
  matrix_reasoning: TaskMatrixReasoning,
  reaction_time:    TaskReactionTime,
}

export default function Assessment() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [params]  = useSearchParams()
  const type      = params.get('type') || 'biweekly'
  const assessStart = useRef(Date.now())

  const [step, setStep]               = useState(-1)
  const [scores, setScores]           = useState({})
  const [taskResults, setTaskResults] = useState({})
  const [saving, setSaving]           = useState(false)
  const [showExit, setShowExit]       = useState(false)

  const currentTask = TASKS[step]

  function handleBack() {
    if (step === -1) { navigate(-1); return }
    setShowExit(true)
  }

  async function handleTaskComplete(taskId, domain, result) {
    const newScores  = { ...scores,       [domain]: result.score }
    const newResults = { ...taskResults,  [taskId]:  result }
    setScores(newScores); setTaskResults(newResults)
    const next = step + 1
    if (next >= TASKS.length) await saveAssessment(newScores, newResults)
    else setStep(next)
  }

  async function saveAssessment(finalScores, finalResults) {
    setSaving(true)
    const totalMs = Date.now() - assessStart.current
    const overall = calcOverallScore({
      memory: finalScores.memory, attention: finalScores.attention,
      workingMem: finalScores.workingMem, reasoning: finalScores.reasoning,
      processing: finalScores.processing,
    })
    if (user) {
      const { data } = await supabase.from('assessments').insert({
        user_id: user.id, type,
        score_memory:      finalScores.memory,
        score_attention:   finalScores.attention,
        score_working_mem: finalScores.workingMem,
        score_reasoning:   finalScores.reasoning,
        score_processing:  finalScores.processing,
        overall_score:     overall,
        task_results:      { ...finalResults, _meta: { totalMs } },
      }).select().single()
      navigate(`/assessment/result/${data?.id}`, { state: { scores: finalScores, overall, type, totalMs } })
    } else {
      navigate('/assessment/result/local', { state: { scores: finalScores, overall, type, totalMs } })
    }
    setSaving(false)
  }

  if (saving) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 size={40} className="animate-spin text-brand-500 mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Generating your cognitive report…</p>
        <p className="text-slate-400 text-sm mt-1">This only takes a moment.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/40 to-white">
      {showExit && <ExitDialog onStay={() => setShowExit(false)} onExit={() => navigate('/dashboard')} />}

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Back / Exit button */}
          <button onClick={handleBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0">
            {step === -1 ? <ArrowLeft size={18} /> : <X size={18} />}
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shrink-0">
              <Brain size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 text-sm leading-tight truncate">
                {type === 'onboarding' ? 'Onboarding Assessment' : 'Biweekly Assessment'}
              </div>
              {step >= 0 && <div className="text-xs text-slate-400 truncate">{currentTask?.title}</div>}
            </div>
          </div>

          {step >= 0 && (
            <div className="flex items-center gap-1.5 shrink-0">
              {TASKS.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${
                  i < step  ? 'w-2.5 h-2.5 bg-teal-400' :
                  i === step ? 'w-3 h-3 bg-brand-500 shadow-sm' :
                  'w-2 h-2 bg-slate-200'
                }`} />
              ))}
            </div>
          )}
        </div>
        {step >= 0 && (
          <div className="h-1 bg-slate-100">
            <div className="h-full bg-gradient-to-r from-brand-500 to-teal-500 transition-all duration-700 ease-out"
              style={{ width: `${((step + 1) / TASKS.length) * 100}%` }} />
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        {step === -1 && (
          <div className="max-w-lg mx-auto text-center animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-brand-100 to-teal-100 flex items-center justify-center text-4xl shadow-sm">🧠</div>
            <h1 className="font-display text-3xl text-slate-900 mb-3">
              {type === 'onboarding' ? 'Welcome Assessment' : 'Biweekly Check-in'}
            </h1>
            <p className="text-slate-500 leading-relaxed mb-6">
              This takes <strong className="text-slate-700">10–15 minutes</strong> and measures five cognitive domains.
              Your results build a profile that tracks how your brain changes over time — valuable data for you and your care team.
            </p>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 text-left space-y-3">
              {TASKS.map((t, i) => {
                const d = DOMAINS[t.domain]
                return (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${d.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{i + 1}</div>
                    <div>
                      <div className="text-sm font-semibold text-slate-700">{t.title}</div>
                      <div className={`text-xs font-medium ${d.text}`}>{d.label} · {d.region}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-6 text-left">
              <p className="text-amber-700 text-xs font-semibold mb-0.5">💡 For best results</p>
              <p className="text-amber-600 text-xs">Find a quiet space, silence notifications, and take your time — there is no overall time limit.</p>
            </div>
            <button onClick={() => setStep(0)} className="btn-primary w-full flex items-center justify-center gap-2 text-base">
              Begin Assessment <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Active task */}
        {step >= 0 && step < TASKS.length && currentTask && (
          <div>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 border
                ${DOMAINS[currentTask.domain].bg} ${DOMAINS[currentTask.domain].text} ${DOMAINS[currentTask.domain].border}`}>
                Task {step + 1} / {TASKS.length} · {DOMAINS[currentTask.domain].label}
              </div>
              <h2 className="font-display text-2xl text-slate-900 mb-2">{currentTask.title}</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">{currentTask.instruction}</p>
            </div>
            {(() => {
              const TaskComponent = TASK_COMPONENTS[currentTask.id]
              return <TaskComponent
                key={currentTask.id}
                onComplete={(result) => handleTaskComplete(currentTask.id, currentTask.domain, result)}
              />
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
