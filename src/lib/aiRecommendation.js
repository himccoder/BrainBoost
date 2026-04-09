/**
 * AI-generated personalised recommendation for cognitive assessment reports.
 * Uses Google Gemini 2.0 Flash — completely free tier (no credit card needed).
 *   Free limits: 1 500 requests/day · 1M tokens/day · 15 req/min
 *   More than enough for personal/clinical use.
 *
 * The API key lives in .env as VITE_GEMINI_API_KEY.
 * Get a free key at: https://aistudio.google.com/apikey
 */

const DOMAIN_LABELS = {
  memory:     'Episodic Memory (hippocampus & temporal lobe)',
  attention:  'Focused Attention (prefrontal cortex)',
  workingMem: 'Working Memory (prefrontal-parietal network)',
  reasoning:  'Fluid Reasoning (parietal lobe & DLPFC)',
  processing: 'Processing Speed (cerebellum & basal ganglia)',
}

function calcAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age >= 0 ? age : null
}

function buildPrompt({ scores, overall, band, type, taskResults, profile }) {
  const age    = calcAge(profile?.date_of_birth)
  const gender = profile?.gender === 'male'   ? 'Male'
               : profile?.gender === 'female' ? 'Female'
               : null
  const name   = profile?.name || 'the patient'

  // Build domain lines sorted best → worst for context
  const domainLines = Object.entries(scores)
    .filter(([, v]) => v != null)
    .sort(([, a], [, b]) => b - a)
    .map(([k, v]) => `  • ${DOMAIN_LABELS[k]}: ${v}/100`)
    .join('\n')

  // Timing highlights if available
  const timingLines = []
  if (taskResults?.stroop_attention?.medianRtMs)
    timingLines.push(`  • Attention median response time: ${taskResults.stroop_attention.medianRtMs} ms`)
  if (taskResults?.reaction_time?.medianRtMs)
    timingLines.push(`  • Processing speed median reaction time: ${taskResults.reaction_time.medianRtMs} ms`)
  if (taskResults?.digit_span?.bestLevel)
    timingLines.push(`  • Best sequence span reached: ${taskResults.digit_span.bestLevel} items`)

  return `You are a compassionate, knowledgeable neuropsychology assistant. Your job is to write a warm, personalised cognitive assessment report summary for a patient.

PATIENT INFORMATION
Name: ${name}
${age != null ? `Age: ${age} years old` : ''}
${gender ? `Gender: ${gender}` : ''}
Assessment type: ${type === 'onboarding' ? 'Onboarding (baseline)' : 'Biweekly follow-up'}

COGNITIVE DOMAIN SCORES (0–100, higher = better)
${domainLines}

Overall cognitive score: ${overall}/100 — Band: ${band}
${timingLines.length > 0 ? `\nRESPONSE TIME DATA\n${timingLines.join('\n')}` : ''}

SCORING METHODOLOGY
Scores are derived from validated neuropsychological instruments:
- Memory: Signal Detection Theory (corrected hit rate)
- Attention: Composite Attention Index (65% accuracy + 35% speed)
- Working Memory: Digit Span normalised to WAIS-IV adult norms
- Reasoning: Accuracy × time-efficiency factor (Raven's principle)
- Processing Speed: Median reaction time (SDMT principle)

INSTRUCTIONS
Write a personalised, warm cognitive report summary for ${name}. Structure it in exactly three short paragraphs:

Paragraph 1 — STRENGTHS: Identify the strongest domain(s). Explain in plain, hopeful language what this means for daily life and why it matters for brain health. Be specific to their score.

Paragraph 2 — GROWTH AREA: Identify the domain with the most room for improvement. Explain gently what this brain region does, how it affects day-to-day life, and why consistent training can help. Reference their specific score and any relevant timing data. Be encouraging, never alarming.

Paragraph 3 — ACTION PLAN: Give 2–3 concrete, specific daily practice suggestions that directly target their weakest domain(s). Mention the relevant BrainBoost games by name where appropriate (Memory Card Match → episodic memory; Stroop Test → attention; Sequence Recall → working memory; Pattern Recognition → fluid reasoning). End with one warm, motivating sentence about the brain's capacity to improve.

IMPORTANT RULES
- Speak directly to the patient using "you" and "your"
- Never say anything alarming, clinical, or diagnostic
- Keep the total response under 280 words
- Do not use bullet points or headers — flowing paragraphs only
- Do not repeat the scores as numbers in the text — describe them qualitatively
- Use accessible language a non-medical person can understand`
}

/**
 * Call Gemini and return the recommendation text.
 * Returns null if the API key is missing (graceful degradation to static recs).
 * Throws on network/API errors so the caller can handle gracefully.
 */
export async function generateAiRecommendation() {
  // AI recommendations temporarily disabled — remove this line to re-enable
  return null

  // eslint-disable-next-line no-unreachable
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('VITE_GEMINI_API_KEY not set — skipping AI recommendation')
    return null
  }

  const prompt = buildPrompt({ scores, overall, band, type, taskResults, profile })

  const systemInstruction = 'You write warm, supportive cognitive health reports for patients managing brain illnesses. Your tone is like a caring neuropsychologist — honest, gentle, and encouraging.'

  const MODELS = [
    'gemini-flash-latest',   // confirmed available on this key
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash',
  ]

  const body = JSON.stringify({
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents:           [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig:   { temperature: 0.65, maxOutputTokens: 550 },
  })

  let lastError = null
  for (const model of MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
    )
    if (res.ok) {
      const json = await res.json()
      return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null
    }
    const err = await res.json().catch(() => ({}))
    lastError = err?.error?.message || `Gemini API error ${res.status}`
    // If the model simply wasn't found, try the next one
    if (res.status === 404 || res.status === 400) continue
    // For quota/auth errors stop immediately — retrying won't help
    break
  }

  throw new Error(lastError || 'No available Gemini model found')
}
