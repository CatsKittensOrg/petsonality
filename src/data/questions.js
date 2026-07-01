export const CAT_EXPRESSIONS = [
  'Tail swishes right', 'Tail swishes left', 'Tail upright', 'Tail tucked',
  'Ears upright', 'Ears outward', 'Ears backward', 'Ears flattened',
  'Licks lips', 'Opens mouth', 'Yawns', 'Slow blinks both eyes', 'Blinks one eye',
  'Pupils dilate', 'Direct stare', 'Turns head away', 'Head leans forward', 'Head retracts back',
  'Whiskers forward', 'Whiskers pulled back', 'Body crouches', 'Body stretches'
]

export const TRAITS = [
  'Confidence', 'Sociability', 'Affection', 'Playfulness', 'Energy',
  'Adaptability', 'Independence', 'Dominance', 'Sensitivity', 'Curiosity'
]

export const CAT_QUESTIONS = [
  {
    id: 'visitor', trait: 'Confidence', text: 'A new visitor enters your home. Your cat usually:',
    answers: [
      { text: 'Hides immediately and stays hidden', score: 1, expression: 'Tail tucked, ears backward, pupils dilate, head retracts back' },
      { text: 'Watches from a distance', score: 2, expression: 'Direct stare, ears outward, body crouches' },
      { text: 'Approaches slowly after observing', score: 3, expression: 'Head leans forward, whiskers forward, tail swishes right' },
      { text: 'Walks up confidently to investigate', score: 4, expression: 'Tail upright, ears upright, slow blinks both eyes' }
    ]
  },
  {
    id: 'noise', trait: 'Sensitivity', text: 'A loud unexpected noise happens nearby. Your cat:',
    answers: [
      { text: 'Runs and hides for a long time', score: 4, expression: 'Pupils dilate, ears flattened, tail tucked' },
      { text: 'Freezes and scans the room', score: 3, expression: 'Direct stare, ears outward, head retracts back' },
      { text: 'Startles but recovers quickly', score: 2, expression: 'Ears backward then upright, licks lips' },
      { text: 'Barely reacts', score: 1, expression: 'Slow blinks both eyes, body stretches' }
    ]
  },
  {
    id: 'petting', trait: 'Affection', text: 'When you sit down, your cat:',
    answers: [
      { text: 'Leaves or avoids contact', score: 1, expression: 'Turns head away, tail swishes left' },
      { text: 'Stays nearby but not touching', score: 2, expression: 'Slow blinks both eyes, ears outward' },
      { text: 'Sits next to you or leans in', score: 3, expression: 'Head leans forward, whiskers forward' },
      { text: 'Climbs on you or asks for cuddles', score: 4, expression: 'Tail upright, slow blinks both eyes, body stretches' }
    ]
  },
  {
    id: 'toy', trait: 'Playfulness', text: 'When a feather toy appears, your cat:',
    answers: [
      { text: 'Ignores it', score: 1, expression: 'Turns head away, slow blinks both eyes' },
      { text: 'Watches but rarely plays', score: 2, expression: 'Direct stare, pupils dilate slightly' },
      { text: 'Plays for a few minutes', score: 3, expression: 'Whiskers forward, head leans forward' },
      { text: 'Gets very engaged and hunts it', score: 4, expression: 'Pupils dilate, tail swishes right, body crouches' }
    ]
  },
  {
    id: 'furniture', trait: 'Adaptability', text: 'You rearrange furniture. Your cat:',
    answers: [
      { text: 'Acts stressed for days', score: 1, expression: 'Licks lips, ears backward, tail tucked' },
      { text: 'Avoids the room at first', score: 2, expression: 'Head retracts back, ears outward' },
      { text: 'Investigates and adjusts', score: 3, expression: 'Head leans forward, whiskers forward' },
      { text: 'Treats it like a new playground', score: 4, expression: 'Tail upright, ears upright, body stretches' }
    ]
  },
  {
    id: 'alone', trait: 'Independence', text: 'When left alone for several hours, your cat:',
    answers: [
      { text: 'Becomes distressed or vocal', score: 1, expression: 'Opens mouth, ears outward, pupils dilate' },
      { text: 'Waits near doors/windows', score: 2, expression: 'Direct stare, tail swishes left' },
      { text: 'Rests normally', score: 3, expression: 'Slow blinks both eyes, body stretches' },
      { text: 'Enjoys independent exploration', score: 4, expression: 'Tail upright, ears upright, head leans forward' }
    ]
  },
  {
    id: 'othercat', trait: 'Dominance', text: 'Another cat enters their space. Your cat:',
    answers: [
      { text: 'Retreats and avoids conflict', score: 1, expression: 'Head retracts back, ears backward' },
      { text: 'Watches cautiously', score: 2, expression: 'Direct stare, tail swishes left' },
      { text: 'Approaches to inspect', score: 3, expression: 'Whiskers forward, head leans forward' },
      { text: 'Controls the space confidently', score: 4, expression: 'Tail upright, direct stare, ears upright' }
    ]
  },
  {
    id: 'newobject', trait: 'Curiosity', text: 'You bring home a new bag or box. Your cat:',
    answers: [
      { text: 'Avoids it', score: 1, expression: 'Turns head away, ears backward' },
      { text: 'Sniffs it after a while', score: 2, expression: 'Head leans forward, licks lips' },
      { text: 'Inspects it right away', score: 3, expression: 'Whiskers forward, ears upright' },
      { text: 'Climbs in, on, or around it', score: 4, expression: 'Tail upright, pupils dilate, body stretches' }
    ]
  }
]

export const OWNER_QUESTIONS = [
  { id: 'home', trait: 'Routine', text: 'My home style is:', answers: ['Calm and predictable', 'Moderately active', 'Very social and busy', 'Always changing'] },
  { id: 'affection', trait: 'Affection', text: 'I prefer a pet who:', answers: ['Is independent', 'Likes occasional attention', 'Is affectionate daily', 'Wants constant closeness'] },
  { id: 'play', trait: 'Energy', text: 'I want playtime to be:', answers: ['Low-key', 'A few minutes', 'Daily interactive play', 'High-energy and frequent'] },
  { id: 'noise', trait: 'Sensitivity', text: 'My household noise level is:', answers: ['Very quiet', 'Average', 'Busy', 'Loud/chaotic'] }
]

export const DEFAULT_RESULT_TEMPLATES = {
  Explorer: {
    name: 'The Explorer',
    description: 'Curious, confident, and motivated by novelty. This cat wants to investigate life first-paw.',
    strengths: 'Adaptable, engaging, playful, and confident in new environments.',
    challenges: 'May get bored without enrichment or boundaries.',
    tips: 'Use puzzle feeders, climbing spaces, rotating toys, and structured exploration.'
  },
  Shadow: {
    name: 'The Loyal Shadow',
    description: 'Affectionate and relationship-focused. This cat bonds deeply with trusted people.',
    strengths: 'Loving, attached, emotionally responsive, and people-oriented.',
    challenges: 'May dislike long separations or major routine changes.',
    tips: 'Use consistent routines, cozy resting places, and predictable affection.'
  },
  Regal: {
    name: 'The Regal Observer',
    description: 'Independent, observant, and selective. This cat prefers respect over pressure.',
    strengths: 'Calm, discerning, self-contained, and thoughtful.',
    challenges: 'May resist forced handling or over-social homes.',
    tips: 'Offer choice, vertical space, quiet zones, and consent-based handling.'
  },
  Tiger: {
    name: 'The Tiny Tiger',
    description: 'Bold, assertive, and energetic. This cat has a strong presence and clear preferences.',
    strengths: 'Confident, entertaining, brave, and expressive.',
    challenges: 'May become bossy, territorial, or overstimulated.',
    tips: 'Use routine play, territory management, and calm introductions with other pets.'
  }
}
