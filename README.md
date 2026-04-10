# BrainBoost — Cognitive Training & Assessment for Neurological Recovery

> A science-backed, gamified cognitive training and assessment platform built for patients living with neurological conditions — and the clinicians who support them.

---

## The Problem

### Concept and What Problem It Solves

Neurological conditions — including Alzheimer's disease, traumatic brain injury (TBI), stroke, multiple sclerosis, and ADHD — affect tens of millions of people worldwide, yet the gap between clinical appointments and daily cognitive care remains almost entirely unaddressed. Patients are diagnosed, treated, and then sent home with little to no structured support for the weeks and months between visits. Cognitive rehabilitation, when it exists, is typically confined to a therapist's office, expensive, and inaccessible to the majority of patients. The result is a silent deterioration that happens in the spaces medicine does not reach.

The deeper problem is not just access — it is meaning. Many patients who are given brain exercises abandon them quickly because no one explains *why* they matter. A list of puzzles without context is just homework. BrainBoost was built on the conviction that understanding your own brain is the most powerful motivator for engaging with it. Every game on this platform is paired with a plain-language explanation of which brain region it trains, what neurological mechanism is at work, and how it connects to real daily experiences — like remembering a name, following a conversation, or making a decision under pressure. When patients understand that a card-matching game is strengthening their hippocampus through Long-Term Potentiation, it stops being a game and becomes something worth doing.

**Key problem points:**
- Cognitive rehabilitation is largely unavailable between clinical visits
- Patients lack structured, evidence-informed tools for home-based brain training
- Existing apps are either too gamified (no clinical grounding) or too clinical (no engagement)
- There is no accessible way for patients to measure cognitive performance outside a hospital setting
- Doctors receive almost no longitudinal data about a patient's cognitive state between appointments

---

## The Solution

### How BrainBoost Solves the Problem

BrainBoost provides a complete home-based cognitive training and assessment system built on validated neuropsychological principles. The four core games each target a specific cognitive domain — episodic memory (hippocampus), focused attention (prefrontal cortex), working memory (prefrontal-parietal network), and fluid reasoning (parietal lobe and DLPFC) — with difficulty that scales naturally as the patient improves. Each session is brief, typically 5–15 minutes, designed to fit around illness, fatigue, and the reality of managing a neurological condition. A gentle sound design, soothing colour palette, and non-alarming interface remove the anxiety that clinical tools often introduce, making the platform genuinely usable by people who are unwell.

Beyond daily training, BrainBoost includes a structured biweekly cognitive assessment — a 10–15 minute session of five sequential tasks scored using the same methodological principles as validated clinical instruments: Signal Detection Theory for memory, the Composite Attention Index for attention, WAIS-IV Digit Span norms for working memory, Raven's Progressive Matrices principles for reasoning, and the Symbol Digit Modalities Test approach for processing speed. Both accuracy and response time are factored into every score. The result is a cognitive profile — a radar chart across five domains, domain scores from 0–100, response-time breakdowns, and a printable report — that means something clinically, not just recreationally. This bridges the gap between the patient's daily experience and the information a neurologist needs to make informed decisions.

**Key solution points:**
- Four science-grounded games covering the most affected cognitive domains in neurological illness
- Scoring formulas derived from validated neuropsychological instruments (SDT, WAIS-IV, SDMT, Raven's)
- Both accuracy and reaction time captured and scored — the same dual-metric approach used in clinical neuropsychology
- Biweekly structured assessments with longitudinal tracking, benchmarked against adult norms
- Printable clinical report designed to be shared with a neurologist or care team
- Completely free tier access — no barrier to the patients who need it most

---

## How It Works

### Procedure: From Play to Report to Clinical Integration

The user journey is designed to be effortless and self-reinforcing. A patient signs in, sees their dashboard, and is gently prompted to complete any outstanding assessment or continue daily training. The four games can be played in any order, in any session, with progress automatically saved. Each game includes three or more difficulty modes and, for Stroop and Sequence, entirely different challenge variants — a Number Count mode that tests quantity perception, a Reverse Recall mode that inverts the sequence, a Colour Sequence mode — ensuring the brain is never able to fully habituate to a single pattern. After every session, the result screen explains what just happened neurologically, turning each game into a micro-lesson. Streaks, badges, and a score dashboard provide enough structure to build a consistent habit without turning recovery into a competitive pressure.

Every two weeks, the patient is prompted to complete the full assessment. The five tasks run in sequence with a progress bar, clear instructions, and a back/exit option at any point. On completion, the platform generates a full report: an overall cognitive score with a performance band, a radar chart showing all five domains, a response-time breakdown per task (median reaction time, average time per reasoning question, best sequence span), personalised recommendations targeting the weakest domain, and a collapsible section explaining the exact formula behind each score. The report is formatted for print — a patient can save it as a PDF and hand it directly to their neurologist. Future development paths are significant: assessment data stored longitudinally in Supabase could be accessed via a clinician portal, where a neurologist or care team member reviews a patient's cognitive trend across months without the patient needing to attend a clinic. API integration with electronic health record (EHR) systems such as FHIR-compliant platforms would allow BrainBoost scores to be written directly into a patient record. AI-generated narrative summaries — already architected in the codebase using the Gemini API — could be expanded to flag statistically significant cognitive decline between assessment cycles and alert the care team automatically.

**Key procedure and integration points:**
- Daily games → biweekly assessment → printable clinical report — a complete closed loop
- Assessment scores use dual metrics (accuracy + RT) across five clinically-mapped domains
- Reports are immediately shareable with neurologists and designed to be clinically legible
- Longitudinal data persisted in Supabase enables multi-month trend analysis
- Architecture supports a future clinician portal: one login, a full view of all registered patients' scores over time
- AI recommendation layer already built — can be extended to flag cognitive decline and trigger alerts
- FHIR/EHR integration is a natural next step to embed BrainBoost data into existing hospital workflows
- The platform requires no clinical oversight to use daily, but produces clinical-grade output when needed

---

## The Games — Science and Purpose

### Memory Card Match
**Domain:** Episodic Memory · **Region:** Hippocampus & Temporal Lobe · **Mechanism:** Long-Term Potentiation

Memory deterioration is one of the earliest symptoms of many neurological conditions. This game requires the player to hold card locations in working memory and recall them on demand. Each successful match triggers dopamine release, chemically reinforcing the hippocampal pathway that was just used — a process called Long-Term Potentiation that physically strengthens synaptic connections over time.

**Themes available:** Nature, Animals, Symbols, Letters, Numbers — preventing habituation.
**Especially beneficial for:** Alzheimer's disease, Mild Cognitive Impairment, post-stroke memory loss, age-related memory decline.

---

### Stroop Colour Test
**Domain:** Executive Function & Focused Attention · **Region:** Prefrontal Cortex & ACC · **Mechanism:** Inhibitory Control

The Stroop task is one of the most validated cognitive tests in neuroscience. When the word "RED" is written in blue ink, the prefrontal cortex must override the automatic reading response and name the ink colour instead. This cognitive conflict directly exercises inhibitory control — the neural skill that allows filtering of distractions in daily life.

**Modes available:** Colour-Word (classic), Number Count (count dots, ignore the number shown), Mixed.
**Especially beneficial for:** ADHD, Traumatic Brain Injury, early dementia, stroke rehabilitation.

---

### Sequence Recall
**Domain:** Working Memory · **Region:** Prefrontal-Parietal Network · **Mechanism:** Visuospatial Working Memory

Working memory is the brain's mental whiteboard. Sequence Recall stress-tests the prefrontal-parietal circuit by requiring the player to reproduce tile sequences of growing length. The graduated challenge keeps the system operating just beyond its current limit — the precise condition for neuroplastic adaptation.

**Modes available:** Forward recall, Reverse recall (sequence backwards), Colour Sequence (identify tiles by colour).
**Especially beneficial for:** ADHD, post-concussion syndrome, Multiple Sclerosis, schizophrenia.

---

### Pattern Recognition
**Domain:** Fluid Reasoning · **Region:** Parietal Cortex & DLPFC · **Mechanism:** Abstract Reasoning

Fluid intelligence — reasoning through novel problems without prior knowledge — declines with age and neurological illness, but is among the most trainable cognitive abilities. Pattern Recognition forces active abstract reasoning: identifying hidden rules in sequences of colours, shapes, numbers, Fibonacci progressions, and geometric multipliers.

**Problem types available (Hard):** Colour cycles, shape alternation, arithmetic progressions, Fibonacci sequences, geometric (×2/×3) sequences.
**Especially beneficial for:** Age-related decline, post-stroke rehabilitation, early dementia, brain injury recovery.

---

## Assessment System

BrainBoost includes a structured biweekly cognitive assessment covering five domains in sequence:

| Task | Domain | Scoring Method | Clinical Basis |
|---|---|---|---|
| Symbol Recognition | Episodic Memory | Hit Rate − False Alarm Rate | Signal Detection Theory (SDT) |
| Colour-Word Attention | Focused Attention | 65% Accuracy + 35% Speed | Composite Attention Index (Conners CPT) |
| Sequence Span | Working Memory | Digit span normalised to norms | WAIS-IV Digit Span |
| Matrix Reasoning | Fluid Reasoning | Accuracy × Time-efficiency factor | Raven's Progressive Matrices |
| Reaction Speed | Processing Speed | Median reaction time | Symbol Digit Modalities Test (SDMT) |

The overall score is a weighted mean: Memory 25% · Working Memory 25% · Attention 20% · Reasoning 20% · Processing Speed 10% — weights reflecting the relative clinical importance of each domain in cognitive ageing research.

The assessment result page includes a radar chart, domain score bars with brain region labels, a response-time breakdown per task, personalised recommendations targeting the weakest domain, a collapsible scoring methodology explanation, and a print-ready clinical report that includes the patient's name, age, and gender for their care team.

---

## Core Features

| Feature | Description |
|---|---|
| **4 science-grounded games** | Each targets a specific brain region with multiple difficulty levels and mode variants |
| **Biweekly assessment** | 5-task structured cognitive evaluation using validated neuropsychological scoring methods |
| **Clinical report** | Print-ready PDF with radar chart, domain scores, response-time data, and recommendations |
| **Progress dashboard** | Score trends, streaks, badges, and assessment history with links to past reports |
| **User profile** | Name, date of birth, and gender stored and shown in reports for clinical context |
| **AI recommendations** (Currently Disabled) | Gemini API integration (toggleable) for personalised narrative summaries per report |
| **Cloud sync** | Supabase authentication — progress saved across all devices |
| **Offline fallback** | localStorage keeps progress for unauthenticated users |
| **Soft sound design** | Web Audio API — gentle programmatic tones, no external audio files |
| **Accessible UI** | Indigo/teal palette, Nunito + DM Serif Display typography, large touch targets, soothing animations |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     BrainBoost Frontend                      │
│                  React 18 + Vite + Tailwind CSS              │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  │
│  │ Landing  │  │ Game Hub │  │ Dashboard  │  │ Profile  │  │
│  └──────────┘  └──────────┘  └────────────┘  └──────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Game Pages (4)                      │   │
│  │  Memory · Stroop · Sequence · Pattern                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Assessment Pages                          │   │
│  │  /assessment  →  /assessment/result/:id              │   │
│  │  5 tasks · scored · report · print-ready             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │   AuthContext       │  │   ProgressContext            │  │
│  │  (session + profile)│  │  (scores, streaks, badges,   │  │
│  │                     │  │   cloud sync + localStorage) │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────┐  ┌───────────────────────────┐    │
│  │  src/lib/sounds.js   │  │  src/lib/aiRecommendation  │   │
│  │  Web Audio API       │  │  Gemini API (toggleable)   │   │
│  └──────────────────────┘  └───────────────────────────┘    │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTPS (Supabase JS SDK)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      Supabase (BaaS)                         │
│                                                              │
│  Auth (email + password)    PostgreSQL Database              │
│                                                              │
│  profiles          (1 : 1)   name, DOB, gender               │
│  game_sessions     (1 : M)   score, accuracy, duration       │
│  user_badges       (1 : M)   badge_id, earned_at             │
│  assessments       (1 : M)   5 domain scores, task_results,  │
│                              overall_score, ai_recommendation │
│                                                              │
│  Row Level Security — users access only their own data       │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    Vercel (Hosting)                          │
│            Static site — auto-deploy on git push             │
└──────────────────────────────────────────────────────────────┘
```

### Data Model

```
profiles
  id              uuid        PK → auth.users.id
  name            text
  date_of_birth   date
  gender          text        ('male' | 'female' | 'prefer_not_to_say')
  created_at      timestamptz

game_sessions
  id                bigint    PK
  user_id           uuid      FK → profiles.id
  game_id           text      ('memory' | 'stroop' | 'sequence' | 'pattern')
  score             int
  accuracy          int
  duration_seconds  int
  played_at         timestamptz

user_badges
  id          bigint      PK
  user_id     uuid        FK → profiles.id
  badge_id    text
  earned_at   timestamptz
  UNIQUE(user_id, badge_id)

assessments
  id                bigint    PK
  user_id           uuid      FK → profiles.id
  type              text      ('onboarding' | 'biweekly')
  score_memory      int       (0–100, Signal Detection Theory)
  score_attention   int       (0–100, Composite Attention Index)
  score_working_mem int       (0–100, WAIS-IV Digit Span norms)
  score_reasoning   int       (0–100, Raven's time-efficiency)
  score_processing  int       (0–100, SDMT median RT)
  overall_score     int       (weighted mean, 0–100)
  task_results      jsonb     (per-task raw data including reaction times)
  ai_recommendation text      (Gemini-generated narrative, nullable)
  started_at        timestamptz
  completed_at      timestamptz
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 6 |
| Charts | Recharts |
| Icons | Lucide React |
| Typography | Nunito + DM Serif Display (Google Fonts) |
| Sound | Web Audio API (programmatically generated — no files) |
| Backend / Auth | Supabase (PostgreSQL + Auth + Row Level Security) |
| AI recommendations | Google Gemini API (gemini-flash-latest, free tier) |
| Hosting | Vercel |
| Offline storage | localStorage (fallback when not signed in) |

---

## Project Structure

```
brainboost/
├── src/
│   ├── components/
│   │   ├── GameResult.jsx          # End-of-session screen with brain science panel
│   │   ├── GameWrapper.jsx         # Per-game header with "Why this game?" panel
│   │   ├── Layout.jsx              # Page shell — Navbar + footer
│   │   └── Navbar.jsx              # Auth-aware nav with user menu
│   ├── context/
│   │   ├── AuthContext.jsx         # Supabase session, profile, updateProfile
│   │   └── ProgressContext.jsx     # Game progress — cloud sync + localStorage
│   ├── data/
│   │   ├── games.js                # Game metadata, biology, science facts
│   │   └── assessment.js           # Domain config, scoring formulas, score bands
│   ├── lib/
│   │   ├── sounds.js               # Web Audio API sound engine
│   │   ├── supabase.js             # Supabase client
│   │   └── aiRecommendation.js     # Gemini API prompt + call
│   ├── pages/
│   │   ├── Landing.jsx             # Home — mission, science, assessment preview
│   │   ├── GameHub.jsx             # Game browser with expandable science cards
│   │   ├── Dashboard.jsx           # Progress, streaks, badges, assessment history
│   │   ├── AuthPage.jsx            # Sign in / Sign up
│   │   ├── Profile.jsx             # Edit name, DOB, gender
│   │   ├── Assessment.jsx          # 5-task assessment runner
│   │   ├── AssessmentResult.jsx    # Report — scores, radar, timing, AI rec
│   │   └── games/
│   │       ├── MemoryGame.jsx
│   │       ├── StroopGame.jsx
│   │       ├── SequenceGame.jsx
│   │       └── PatternGame.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env                                  # Local secrets — never committed
├── .env.example
├── .gitignore
├── supabase_schema.sql                   # Initial database schema
├── supabase_fix.sql                      # Trigger hotfix for user creation
├── supabase_assessment.sql               # Assessment table
├── supabase_add_duration.sql             # Adds duration_seconds to game_sessions
├── supabase_add_ai_recommendation.sql    # Adds ai_recommendation to assessments
├── supabase_profile_update.sql           # Adds date_of_birth + gender to profiles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) project
- A free [Google AI Studio](https://aistudio.google.com) API key (optional — for AI recommendations)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template
cp .env.example .env

# 3. Fill in your credentials in .env:
#    VITE_SUPABASE_URL=https://your-project.supabase.co
#    VITE_SUPABASE_ANON_KEY=your-anon-key
#    VITE_GEMINI_API_KEY=your-gemini-key   (optional)

# 4. Set up the database — run each SQL file in order in
#    Supabase → SQL Editor → New query → Run:
#      supabase_schema.sql
#      supabase_fix.sql
#      supabase_assessment.sql
#      supabase_add_duration.sql
#      supabase_add_ai_recommendation.sql
#      supabase_profile_update.sql

# 5. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Deployment (Vercel)

1. Push the repository to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and optionally `VITE_GEMINI_API_KEY`
4. Deploy — Vercel handles the build automatically
5. Update **Supabase → Authentication → URL Configuration** with your live Vercel URL

---

## Roadmap

- **Clinician portal** — a separate authenticated view where a neurologist can see all their registered patients' assessment histories and cognitive trends in one dashboard
- **EHR / FHIR integration** — write assessment scores directly into hospital electronic health record systems
- **AI decline detection** — extend the Gemini integration to flag statistically significant drops between assessment cycles and alert the care team
- **Caregiver mode** — allow a family member or carer to manage a patient's account and receive progress summaries
- **Additional domains** — language fluency (verbal fluency tasks), spatial navigation (visuospatial tasks), and social cognition assessments

---

## Acknowledgements

Built for patients, caregivers, and clinicians who believe that consistent, meaningful practice can change the brain — because the science says it can.
