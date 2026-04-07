/**
 * BrainBoost Sound Engine
 * All sounds are generated via the Web Audio API — no external files needed.
 * Tones are intentionally soft and non-jarring for patients.
 */

let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  // Resume if suspended (browsers require a user gesture first)
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/**
 * Play a single pure tone with a smooth fade-out.
 * @param {number}  freq      - Hz
 * @param {number}  duration  - seconds
 * @param {string}  type      - OscillatorType ('sine'|'triangle'|'square')
 * @param {number}  volume    - 0–1
 * @param {number}  delay     - seconds before starting
 */
function tone(freq, duration = 0.18, type = 'sine', volume = 0.18, delay = 0) {
  try {
    const ac  = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()

    osc.connect(gain)
    gain.connect(ac.destination)

    osc.type = type
    osc.frequency.value = freq

    const start = ac.currentTime + delay
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(volume, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

    osc.start(start)
    osc.stop(start + duration + 0.05)
  } catch {
    // Silently ignore if AudioContext is unavailable
  }
}

/** Play notes in sequence (arpeggio / chime) */
function arpeggio(notes, stepDuration = 0.12, volume = 0.15) {
  notes.forEach(([freq, delay]) => tone(freq, stepDuration, 'sine', volume, delay))
}

// ─── Game Sound Definitions ────────────────────────────────────────────────

export const sounds = {
  /** Soft click when flipping a card */
  cardFlip() {
    tone(520, 0.08, 'sine', 0.12)
  },

  /** Pleasant ascending chime when two cards match */
  cardMatch() {
    arpeggio([
      [523.25, 0.00],   // C5
      [659.25, 0.10],   // E5
      [783.99, 0.20],   // G5
    ], 0.22, 0.16)
  },

  /** Soft descending tone on a mismatch — not harsh */
  cardMismatch() {
    arpeggio([
      [330, 0.00],
      [277, 0.12],
    ], 0.18, 0.12)
  },

  /** All pairs found — warm full chord */
  gameWin() {
    arpeggio([
      [523.25, 0.00],
      [659.25, 0.08],
      [783.99, 0.16],
      [1046.5, 0.24],
    ], 0.35, 0.14)
  },

  /** Correct answer — quick bright ding */
  correct() {
    arpeggio([
      [660, 0.00],
      [880, 0.09],
    ], 0.18, 0.15)
  },

  /** Wrong answer — soft dull tone, not alarming */
  wrong() {
    tone(220, 0.25, 'sine', 0.13)
  },

  /** Tile tap in sequence game — short ping */
  tileTap() {
    tone(600, 0.09, 'sine', 0.14)
  },

  /** Tile lighting up during sequence playback — gentle pulse */
  tileShow() {
    tone(440, 0.12, 'sine', 0.10)
  },

  /** Level up in sequence game — ascending run */
  levelUp() {
    arpeggio([
      [523.25, 0.00],
      [587.33, 0.09],
      [659.25, 0.18],
      [783.99, 0.27],
    ], 0.20, 0.13)
  },

  /** Session complete — warm resolving chord */
  sessionComplete() {
    arpeggio([
      [392.00, 0.00],   // G4
      [523.25, 0.10],   // C5
      [659.25, 0.20],   // E5
      [783.99, 0.30],   // G5
    ], 0.40, 0.14)
  },
}
