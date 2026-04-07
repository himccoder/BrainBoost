# 🧠 BrainBoost — Cognitive Training for Recovery & Resilience

> A science-backed, gamified cognitive training platform designed for patients living with neurological conditions — and for anyone who wants to actively invest in their brain health.

---

## What is BrainBoost?

BrainBoost is a web application that helps people with brain conditions — such as Alzheimer's disease, traumatic brain injury, ADHD, stroke, and multiple sclerosis — exercise their cognitive abilities through short, meaningful daily games.

The core belief behind this platform is simple: **your brain is not fixed**. At any age, and even after injury or illness, the brain retains the ability to form new connections and strengthen existing ones. This is called **neuroplasticity** — and it is the scientific foundation that every feature of BrainBoost is built on.

BrainBoost is not entertainment. It is deliberate, targeted stimulation of the specific neural systems that neurological conditions affect most. Every game is paired with a plain-language explanation of *which part of the brain it trains*, *why that matters for the patient's daily life*, and *what the science says about its effectiveness*.

We believe that understanding *why* you're doing something is as important as doing it. Motivation collapses without meaning. BrainBoost gives patients both.

---

## Who is this for?

BrainBoost is designed primarily for:

- Patients with **Alzheimer's disease or Mild Cognitive Impairment** looking to slow memory decline
- Patients recovering from **stroke or traumatic brain injury (TBI)**
- People living with **ADHD**, managing attention and impulse control
- Patients with **Multiple Sclerosis** or **post-concussion syndrome** experiencing working memory difficulties
- People with **early-stage dementia** seeking to maintain cognitive independence
- Anyone experiencing **age-related cognitive decline** who wants to stay sharp

It is also appropriate for caregivers and clinicians who want to offer patients a structured, evidence-informed digital tool for home-based cognitive rehabilitation.

> **Note:** BrainBoost is a supportive training tool, not a medical treatment. It is not a substitute for professional medical advice, diagnosis, or therapy. Always consult a healthcare provider about cognitive rehabilitation.

---

## The Games — and Why They Matter

### 🧠 Memory Card Match
**Cognitive Domain:** Episodic Memory
**Brain Region:** Hippocampus & Temporal Lobe
**Mechanism:** Long-Term Potentiation (LTP)

Memory deterioration is one of the earliest and most distressing symptoms of many neurological conditions. The hippocampus — a small, seahorse-shaped structure deep in the brain — is responsible for forming new memories and consolidating them into long-term storage. Like a muscle, it responds to being challenged.

Memory Card Match works by requiring the player to hold the location of unseen cards in mind and recall them when needed. Each successful recall triggers a small dopamine release, which chemically reinforces the exact neural pathway that was just used. Over time and with repetition, this process — called Long-Term Potentiation — physically strengthens synaptic connections in the hippocampus.

**What patients can expect:** Improved ability to recall names, locations of objects, appointments, and recent events. Research shows that memory training can increase hippocampal grey matter volume by up to 3% over 6 weeks of consistent practice.

**Especially beneficial for:** Alzheimer's disease, Mild Cognitive Impairment, post-stroke memory loss, age-related memory decline.

---

### 🎨 Stroop Color Test
**Cognitive Domain:** Executive Function
**Brain Region:** Prefrontal Cortex & Anterior Cingulate Cortex
**Mechanism:** Inhibitory Control & Cognitive Flexibility

The prefrontal cortex is often called the brain's CEO — it governs decision-making, impulse control, focus, and the ability to filter irrelevant information. In conditions like ADHD, TBI, and early dementia, this region is one of the first to lose efficiency.

The Stroop task is one of the most validated cognitive tests in neuroscience. When a color word (e.g. "RED") is shown in a different ink color (e.g. blue), two brain systems compete: the automatic reading system says "RED", but the prefrontal cortex must override it and say "blue." This mental conflict, known as cognitive interference, is precisely what exercises and strengthens inhibitory control.

Repeating this task builds the neural pathways responsible for suppressing automatic, habitual responses — a skill that transfers directly to real-world situations like staying focused during a conversation, resisting distractions, and making careful decisions.

**What patients can expect:** Better focus in daily tasks, reduced distractibility, improved ability to follow multi-step processes. Stroop training has been shown to reduce interference response times by 18–25% after 4 weeks.

**Especially beneficial for:** ADHD & attention deficits, Traumatic Brain Injury (TBI), early dementia, stroke rehabilitation.

---

### 🔢 Sequence Recall
**Cognitive Domain:** Working Memory
**Brain Region:** Prefrontal Cortex & Parietal Lobe
**Mechanism:** Visuospatial Working Memory

Working memory is the brain's mental whiteboard — the system that holds information actively in mind while you use it. It is what allows you to remember a phone number long enough to dial it, follow a set of spoken instructions, track a conversation, or keep your place in a multi-step task.

In many neurological conditions, the prefrontal-parietal circuit that powers working memory loses efficiency — information "falls off the whiteboard" faster than it should. Sequence Recall directly stress-tests this circuit: the player must watch a sequence of tiles light up and reproduce them in exact order. Each correct response lengthens the sequence by one step.

This creates a graduated challenge that continually pushes the working memory system just beyond its current limit — the sweet spot for neuroplasticity. The repeated signal between prefrontal cortex and parietal lobe builds faster, more reliable connections over time.

**What patients can expect:** Improved ability to follow conversations, retain multi-step instructions, and manage day-to-day tasks independently. Working memory is one of the strongest predictors of functional independence in patients with neurological conditions.

**Especially beneficial for:** ADHD & learning disabilities, schizophrenia, post-concussion syndrome, Multiple Sclerosis.

---

### 🔷 Pattern Recognition
**Cognitive Domain:** Fluid Intelligence
**Brain Region:** Parietal Cortex & Dorsolateral Prefrontal Cortex
**Mechanism:** Abstract Reasoning & Fluid Intelligence

Fluid intelligence is the raw capacity to reason through novel problems — to figure things out without relying on memorized facts or past experience. It is the foundation of adaptive thinking: planning, problem-solving, handling unexpected situations.

Unlike crystallized knowledge (facts and skills accumulated over a lifetime), fluid intelligence begins declining in early adulthood and is significantly impacted by neurological conditions. However, it is also one of the most trainable cognitive abilities identified in modern neuroscience.

Pattern Recognition exercises the parietal-prefrontal network by requiring the player to identify a hidden rule in a sequence of colors, shapes, or numbers and predict what comes next. This forces the brain into active abstract reasoning — not just remembering, but *thinking*. The plasticity gains from this type of training have been shown to generalize: improvements in abstract reasoning transfer to other untrained cognitive tasks.

**What patients can expect:** Clearer thinking, better planning, improved ability to adapt to new situations and navigate daily challenges that require problem-solving. Fluid intelligence training produces measurable improvements that generalize to untrained cognitive challenges.

**Especially beneficial for:** Age-related cognitive decline, post-stroke rehabilitation, early-stage dementia, brain injury recovery.

---

## Core Features

| Feature | Description |
|---|---|
| **Science-first design** | Every game includes a full biological explanation — which brain region it targets, what mechanism is being trained, and what conditions it helps |
| **Adaptive difficulty** | Games scale with the player. Memory has 3 difficulty levels; Sequence grows one step at a time; Pattern spans three tiers |
| **Progress dashboard** | Radar chart across all 4 cognitive domains, per-game score trends, streaks, and badges |
| **Cloud sync** | Sign in to save progress across devices via Supabase authentication |
| **Offline support** | Progress is saved to localStorage for users who play without an account |
| **Soft sound design** | All sounds are generated with the Web Audio API — gentle tones, chimes, and feedback sounds that reinforce correct behaviour without startling patients |
| **Accessible UI** | Soothing indigo/teal colour palette, rounded typography (Nunito + DM Serif Display), generous spacing, and large touch targets |
| **Motivational framing** | Every result screen explains what just happened in the brain — turning each session into a moment of understanding, not just scoring |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  BrainBoost Frontend                │
│                 React 18 + Vite + Tailwind           │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Landing  │  │ Game Hub │  │     Dashboard      │ │
│  │  Page    │  │ /games   │  │   /dashboard       │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │                 Game Pages                   │   │
│  │  /games/memory  /games/stroop                │   │
│  │  /games/sequence  /games/pattern             │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌────────────────────┐  ┌───────────────────────┐  │
│  │   AuthContext      │  │   ProgressContext     │  │
│  │  (session state)   │  │  (scores, streaks,    │  │
│  │                    │  │   badges, sync)       │  │
│  └────────────────────┘  └───────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │            src/lib/sounds.js                 │   │
│  │      Web Audio API — no external files       │   │
│  └──────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS (Supabase JS SDK)
                        ▼
┌─────────────────────────────────────────────────────┐
│                   Supabase (BaaS)                   │
│                                                      │
│  ┌──────────────┐  ┌─────────────────────────────┐  │
│  │  Auth        │  │  PostgreSQL Database        │  │
│  │  (email +    │  │                             │  │
│  │   password)  │  │  profiles        (1 : 1)    │  │
│  └──────────────┘  │  game_sessions   (1 : many) │  │
│                    │  user_badges     (1 : many) │  │
│                    └─────────────────────────────┘  │
│                                                      │
│  Row Level Security: users access only their data   │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                Vercel (Hosting)                     │
│         Static site — auto-deploy on git push       │
└─────────────────────────────────────────────────────┘
```

### Data model

```
profiles
  id          uuid  PK  → auth.users.id
  name        text
  created_at  timestamptz

game_sessions
  id          bigint  PK
  user_id     uuid    FK → profiles.id
  game_id     text    ('memory' | 'stroop' | 'sequence' | 'pattern')
  score       int
  accuracy    int
  played_at   timestamptz

user_badges
  id          bigint  PK
  user_id     uuid    FK → profiles.id
  badge_id    text    ('first_session' | 'ten_sessions' | 'streak_3' | 'streak_7' | 'perfect_100')
  earned_at   timestamptz
  UNIQUE(user_id, badge_id)
```

### Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 6 |
| Charts | Recharts |
| Icons | Lucide React |
| Typography | Nunito + DM Serif Display (Google Fonts) |
| Sound | Web Audio API (no files — generated programmatically) |
| Backend / Auth | Supabase (PostgreSQL + Auth) |
| Hosting | Vercel |
| Offline storage | localStorage (fallback when not signed in) |

---

## Project Structure

```
brainboost/
├── public/
├── src/
│   ├── components/
│   │   ├── GameResult.jsx      # End-of-session screen with brain science panel
│   │   ├── GameWrapper.jsx     # Per-game header with "Why this game?" toggle
│   │   ├── Layout.jsx          # Page shell with Navbar + footer
│   │   └── Navbar.jsx          # Sticky nav with auth state / user menu
│   ├── context/
│   │   ├── AuthContext.jsx     # Supabase session, sign in/up/out
│   │   └── ProgressContext.jsx # Game progress — cloud sync + localStorage fallback
│   ├── data/
│   │   └── games.js            # All game metadata, biology, science facts, colours
│   ├── lib/
│   │   ├── sounds.js           # Web Audio API sound engine
│   │   └── supabase.js         # Supabase client initialisation
│   ├── pages/
│   │   ├── AuthPage.jsx        # Sign in / Sign up
│   │   ├── Dashboard.jsx       # Progress charts, streaks, badges
│   │   ├── GameHub.jsx         # Game browser with expandable science cards
│   │   ├── Landing.jsx         # Home page — mission, science, CTA
│   │   └── games/
│   │       ├── MemoryGame.jsx
│   │       ├── StroopGame.jsx
│   │       ├── SequenceGame.jsx
│   │       └── PatternGame.jsx
│   ├── App.jsx                 # Router, providers, protected routes
│   ├── index.css               # Tailwind base + custom component classes
│   └── main.jsx
├── .env                        # Local secrets — never committed
├── .env.example                # Template for contributors
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── supabase_schema.sql         # Database schema (run once in Supabase SQL editor)
├── supabase_fix.sql            # Trigger hotfix for new user creation
├── tailwind.config.js
└── vite.config.js
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) project

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your Supabase credentials
cp .env.example .env

# 3. In .env, set:
#    VITE_SUPABASE_URL=https://your-project.supabase.co
#    VITE_SUPABASE_ANON_KEY=your-anon-key

# 4. Set up the database — paste supabase_schema.sql into
#    Supabase → SQL Editor → New query → Run
#    Then paste supabase_fix.sql and Run that too.

# 5. Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## Deployment

BrainBoost is deployed on [Vercel](https://vercel.com). Add the two Supabase environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings before deploying. See the deployment guide in the project for full steps.

After deploying, update **Supabase → Authentication → URL Configuration** with your live Vercel URL so that email confirmation redirects work correctly.

---

## Acknowledgements

Built with care for patients, caregivers, and clinicians who believe that consistent, meaningful practice can change the brain — because the science says it can.
