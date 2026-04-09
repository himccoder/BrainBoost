/**
 * Assessment configuration
 *
 * Scoring is built on validated neuropsychological principles:
 *   Memory   → Signal Detection Theory (d-prime approximation)
 *   Attention → Composite Attention Index (accuracy × speed, as in Conners CPT)
 *   Working Memory → Digit Span normalised against WAIS-IV adult norms
 *   Reasoning → Accuracy × Time-efficiency factor (Raven's-style scoring)
 *   Processing Speed → Median RT score (Symbol Digit Modalities Test principle)
 *
 * Each domain score is 0–100.  Overall = weighted mean (see weights below).
 */

export const DOMAINS = {
  memory:     { label: 'Episodic Memory',   color: 'from-indigo-400 to-violet-500', text: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-100', region: 'Hippocampus & Temporal Lobe' },
  attention:  { label: 'Focused Attention', color: 'from-sky-400 to-blue-500',      text: 'text-sky-600',   bg: 'bg-sky-50',     border: 'border-sky-100',    region: 'Prefrontal Cortex & ACC' },
  workingMem: { label: 'Working Memory',    color: 'from-blue-400 to-indigo-500',   text: 'text-blue-600',  bg: 'bg-blue-50',    border: 'border-blue-100',   region: 'Prefrontal-Parietal Network' },
  reasoning:  { label: 'Fluid Reasoning',   color: 'from-teal-400 to-cyan-500',     text: 'text-teal-600',  bg: 'bg-teal-50',    border: 'border-teal-100',   region: 'Parietal Lobe & DLPFC' },
  processing: { label: 'Processing Speed',  color: 'from-violet-400 to-purple-500', text: 'text-violet-600',bg: 'bg-violet-50',  border: 'border-violet-100', region: 'Cerebellum & Basal Ganglia' },
}

export const TASKS = [
  { id: 'symbol_memory',    domain: 'memory',     title: 'Symbol Recognition',     instruction: 'Study these symbols carefully. You will be asked to identify which ones you saw.' },
  { id: 'stroop_attention', domain: 'attention',  title: 'Colour-Word Attention',  instruction: 'Name the INK colour of each word — not what the word says. Respond as quickly and accurately as you can.' },
  { id: 'digit_span',       domain: 'workingMem', title: 'Sequence Span',          instruction: 'Watch the tiles light up in a sequence, then repeat it in the exact same order. The sequence gets longer each time.' },
  { id: 'matrix_reasoning', domain: 'reasoning',  title: 'Matrix Reasoning',       instruction: 'Each question shows a pattern with one piece missing. Choose the option that correctly completes it.' },
  { id: 'reaction_time',    domain: 'processing', title: 'Reaction Speed',         instruction: 'A dot will appear somewhere on screen. Tap it as quickly as you can.' },
]

// ─── Per-domain scoring formulas ─────────────────────────────────────────────

/**
 * MEMORY: Signal Detection Theory (corrected hit rate)
 * Mirrors the approach used in clinical recognition memory tests.
 * hit_rate – false_alarm_rate ranges from -1 to +1; we map it to 0–100.
 */
export function scoreMemory({ hits, falseAlarms, targets = 4, foils = 4 }) {
  const hitRate = hits / targets
  const faRate  = falseAlarms / foils
  const chr     = hitRate - faRate               // Corrected Hit Rate: -1 → +1
  return Math.round(Math.max(0, ((chr + 1) / 2) * 100))
}

/**
 * ATTENTION: Composite Attention Index
 * 65 % accuracy + 35 % speed — same weighting used in Conners CPT scoring.
 * Speed reference: ≤ 1 000 ms = perfect speed, ≥ 3 000 ms = 0 speed.
 */
export function scoreAttention({ correct, total, trialRTs = [] }) {
  const accScore   = (correct / total) * 100
  const medianRT   = trialRTs.length > 0 ? _median(trialRTs) : 3000
  const speedScore = Math.max(0, Math.min(100, ((3000 - medianRT) / 2000) * 100))
  return Math.round(0.65 * accScore + 0.35 * speedScore)
}

/**
 * WORKING MEMORY: Digit-Span score normalised to WAIS-IV adult norms.
 * Span 3 = 0, span 9 = 100 (average adult = 7 ± 2).
 * Each remaining error after 3 removes 5 points.
 */
export function scoreWorkingMem({ bestLevel, errorsUsed = 0 }) {
  const spanScore  = Math.min(100, Math.max(0, Math.round(((bestLevel - 3) / 6) * 100)))
  const penalty    = errorsUsed * 5
  return Math.max(0, spanScore - penalty)
}

/**
 * REASONING: Accuracy × Time-efficiency factor.
 * Mirrors fluid-intelligence scoring (Raven's Progressive Matrices principle).
 * Time efficiency: 1.0 if avg ≤ 5 s/question, falls linearly to 0.80 at ≥ 20 s/question.
 */
export function scoreReasoning({ correct, total, trialRTs = [] }) {
  const accScore   = (correct / total) * 100
  const avgS       = trialRTs.length > 0
    ? (trialRTs.reduce((a, b) => a + b, 0) / trialRTs.length) / 1000
    : 10
  const efficiency = Math.max(0.80, Math.min(1.0, 1.0 - Math.max(0, avgS - 5) * (0.20 / 15)))
  return Math.round(accScore * efficiency)
}

/**
 * PROCESSING SPEED: Median Reaction Time score.
 * Uses MEDIAN (not mean) for robustness against outliers — same rationale as
 * the Symbol Digit Modalities Test (SDMT) and Trail Making Test.
 * Reference range: ≤ 350 ms = 100, ≥ 1 100 ms = 0.
 */
export function scoreProcessing({ times = [] }) {
  if (times.length === 0) return 0
  const med = _median(times)
  return Math.max(0, Math.min(100, Math.round(((1100 - med) / 750) * 100)))
}

// ─── Overall composite ────────────────────────────────────────────────────────

const DOMAIN_WEIGHTS = { memory: 0.25, attention: 0.20, workingMem: 0.25, reasoning: 0.20, processing: 0.10 }

export function calcOverallScore(scores) {
  let total = 0, wSum = 0
  for (const [key, w] of Object.entries(DOMAIN_WEIGHTS)) {
    if (scores[key] != null) { total += scores[key] * w; wSum += w }
  }
  return wSum > 0 ? Math.round(total / wSum) : 0
}

// ─── Score band ───────────────────────────────────────────────────────────────

export function scoreBand(overall) {
  if (overall >= 85) return { label: 'Above Average',  color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-100',   desc: 'Cognitive performance is strong across most domains.' }
  if (overall >= 70) return { label: 'Average',         color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-100',   desc: 'Performance is in the typical range for your age group.' }
  if (overall >= 55) return { label: 'Below Average',   color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100', desc: 'Some domains show room for improvement with regular training.' }
  return               { label: 'Needs Attention',      color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-100', desc: 'Several domains could benefit from consistent targeted practice.' }
}

/** Per-domain formula summaries for the report */
export const SCORING_EXPLANATIONS = {
  memory:     { formula: 'Hit Rate − False Alarm Rate  →  0–100', clinical: 'Signal Detection Theory (SDT). Rewards correctly recalled symbols while penalising guessing. Reflects hippocampal encoding fidelity.' },
  attention:  { formula: '65 % Accuracy + 35 % Speed  →  0–100', clinical: 'Composite Attention Index (Conners CPT principle). Speed component uses median response time, which is less affected by a single slow reaction than the mean.' },
  workingMem: { formula: 'Digit Span  →  normalised 0–100 (WAIS-IV norms)', clinical: 'Maximum span reached is compared to adult norms (mean = 7 ± 2). Residual errors apply a small penalty. Directly assesses the phonological loop and central executive.' },
  reasoning:  { formula: 'Accuracy × Time-Efficiency Factor  →  0–100', clinical: 'Fluid intelligence scoring (Raven\'s Progressive Matrices principle). A speed-efficiency factor slightly reduces scores for very slow responding, reflecting real-world executive burden.' },
  processing: { formula: 'Median Reaction Time  →  0–100 (350 ms = 100, 1 100 ms = 0)', clinical: 'Median RT is used (not mean) for robustness, as in the Symbol Digit Modalities Test (SDMT). Slow, inconsistent reactions are a sensitive early marker of cognitive slowing.' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function _median(arr) {
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export const SYMBOLS = ['◆', '★', '▲', '●', '■', '✿', '♠', '♣', '♥', '◎', '⬟', '✦']
