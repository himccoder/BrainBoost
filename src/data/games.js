export const GAMES = [
  {
    id: 'memory',
    title: 'Memory Card Match',
    tagline: 'Strengthen your ability to hold and recall information',
    icon: '🧠',
    color: 'from-indigo-400 to-violet-500',
    cardColor: 'bg-indigo-50 border-indigo-100',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    domain: 'Episodic Memory',
    difficulty: 'Beginner',
    duration: '3–5 min',
    path: '/games/memory',

    shortBio: `Flip cards to find matching pairs. Each match strengthens the neural pathways your brain uses to store and retrieve memories.`,

    whyPlay: `Memory deterioration is one of the earliest and most distressing effects of many neurological conditions. The hippocampus — a seahorse-shaped structure deep in your brain — is responsible for forming new memories. Just like muscles grow stronger with exercise, your hippocampus responds to active memory challenges by reinforcing synaptic connections through a process called Long-Term Potentiation (LTP). Every time you correctly recall a card's location, your brain releases dopamine, which not only feels rewarding but chemically strengthens that exact memory pathway. Over weeks of consistent practice, this can slow memory decline and even improve daily recall.`,

    brainRegion: 'Hippocampus & Temporal Lobe',
    mechanism: 'Long-Term Potentiation (LTP)',
    benefitsFor: ["Alzheimer's disease", 'Mild Cognitive Impairment', 'Post-stroke memory loss', 'Age-related memory decline'],
    scienceFact: `Studies show that memory training can increase hippocampal grey matter volume by up to 3% in adults over 6 weeks.`,
  },
  {
    id: 'stroop',
    title: 'Stroop Color Test',
    tagline: 'Train your brain to focus and override distractions',
    icon: '🎨',
    color: 'from-sky-400 to-blue-500',
    cardColor: 'bg-sky-50 border-sky-100',
    badgeColor: 'bg-sky-100 text-sky-700',
    domain: 'Executive Function',
    difficulty: 'Intermediate',
    duration: '2–4 min',
    path: '/games/stroop',

    shortBio: `Name the ink color of words — not what the word says. This classic test challenges your brain's ability to suppress automatic responses.`,

    whyPlay: `The Stroop effect reveals how your brain handles conflict. When a word like "RED" is printed in blue ink, two regions of your brain argue: the visual word area (which automatically reads "RED") and the prefrontal cortex (which must override this to say "blue"). This conflict is called cognitive interference, and training to resolve it strengthens your executive control network. The prefrontal cortex — the brain's CEO — is critical for decision-making, impulse control, and filtering out distractions. For patients with ADHD, traumatic brain injury, or early dementia, this network weakens significantly. Practicing the Stroop task repeatedly rebuilds these inhibitory pathways and improves real-world focus.`,

    brainRegion: 'Prefrontal Cortex & Anterior Cingulate Cortex',
    mechanism: 'Inhibitory Control & Cognitive Flexibility',
    benefitsFor: ['ADHD & attention deficits', 'Traumatic Brain Injury (TBI)', 'Early dementia', 'Stroke rehabilitation'],
    scienceFact: `Stroop training has been shown to reduce interference response times by 18–25% after 4 weeks of regular practice.`,
  },
  {
    id: 'sequence',
    title: 'Sequence Recall',
    tagline: 'Boost the mental workspace your brain uses every day',
    icon: '🔢',
    color: 'from-blue-400 to-indigo-500',
    cardColor: 'bg-blue-50 border-blue-100',
    badgeColor: 'bg-blue-100 text-blue-700',
    domain: 'Working Memory',
    difficulty: 'Intermediate',
    duration: '3–5 min',
    path: '/games/sequence',

    shortBio: `Watch a sequence of tiles light up, then repeat it in the correct order. Each correct round adds one more step to the challenge.`,

    whyPlay: `Working memory is your brain's mental whiteboard — the temporary space where you hold and manipulate information in real-time. It's what lets you remember a phone number long enough to dial it, follow multi-step instructions, or keep track of a conversation. It relies on a tight circuit between the prefrontal cortex and the parietal cortex. In many neurological conditions, this circuit loses efficiency — information falls off the whiteboard too quickly. Sequence recall tasks directly stress-test and rebuild this circuit. Each round you complete successfully is your prefrontal cortex telling the parietal lobe to remember this. That repeated signal, over time, creates stronger and faster neural connections.`,

    brainRegion: 'Prefrontal Cortex & Parietal Lobe',
    mechanism: 'Visuospatial Working Memory',
    benefitsFor: ['ADHD & learning disabilities', 'Schizophrenia', 'Post-concussion syndrome', 'Multiple Sclerosis'],
    scienceFact: `Working memory capacity is one of the strongest predictors of academic and professional performance — and it can be increased through training.`,
  },
  {
    id: 'pattern',
    title: 'Pattern Recognition',
    tagline: 'Sharpen the logical reasoning at the core of all thought',
    icon: '🔷',
    color: 'from-teal-400 to-cyan-500',
    cardColor: 'bg-teal-50 border-teal-100',
    badgeColor: 'bg-teal-100 text-teal-700',
    domain: 'Fluid Intelligence',
    difficulty: 'Advanced',
    duration: '4–6 min',
    path: '/games/pattern',

    shortBio: `Identify which shape completes a visual pattern. This exercises your brain's ability to reason abstractly and spot hidden rules.`,

    whyPlay: `Fluid intelligence is your raw problem-solving ability — the capacity to reason through novel problems without relying on prior knowledge. It depends heavily on the parietal cortex (which processes spatial relationships) and the prefrontal cortex (which applies logical rules). Unlike crystallized intelligence (stored facts), fluid intelligence naturally declines with age and brain injury. But research shows it is also one of the most trainable cognitive abilities. By repeatedly finding the hidden rule in a pattern, you're forcing your parietal-prefrontal network to flex and adapt. This neural flexibility transfers to real-world benefits: better planning, clearer reasoning, and improved ability to handle unexpected situations.`,

    brainRegion: 'Parietal Cortex & Dorsolateral Prefrontal Cortex',
    mechanism: 'Abstract Reasoning & Fluid Intelligence',
    benefitsFor: ['Age-related cognitive decline', 'Post-stroke rehabilitation', 'Early-stage dementia', 'Brain injury recovery'],
    scienceFact: `Fluid intelligence training produces measurable improvements in IQ-adjacent reasoning tasks and generalizes to untrained cognitive challenges.`,
  },
]

export const BADGES = {
  first_session: { label: 'First Step',      icon: '🌱', desc: 'Completed your very first session' },
  ten_sessions:  { label: 'Consistent Mind', icon: '🔥', desc: 'Completed 10 total sessions' },
  streak_3:      { label: '3-Day Streak',    icon: '⚡', desc: 'Played 3 days in a row' },
  streak_7:      { label: 'Week Warrior',    icon: '🏆', desc: 'Played 7 days in a row' },
  perfect_100:   { label: 'Perfect Score',   icon: '💎', desc: 'Scored 100 in any game' },
}
