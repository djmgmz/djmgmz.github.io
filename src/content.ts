/** Identifies a project; also used as its section id and nav anchor. */
export type LegId = 'rigrag' | 'fullcourt'

/** Name, credentials and intro shown on the profile coupon. */
export const profile = {
  name: 'Dominic Gomez',
  fullName: 'Dominic Joel M. Gomez',
  handle: 'djmgmz',
  role: 'Full-stack developer',
  school: 'De La Salle University',
  year: '4th year, BS Computer Science',
  base: 'Parañaque City, Philippines',
  photo: '/assets/profilephoto.jpg',
  intro:
    'I’m a full-stack developer who builds the things I get curious about, from the database all the way up to the buttons. If an idea keeps me up at night, it usually turns into a project. Both projects below can be tried right here on this page.',
}

/** One project's boarding-pass copy. */
export interface Leg {
  id: LegId
  /** Short label in the coupon head, such as "Project 01". */
  code: string
  name: string
  /** One-line category shown on the coupon's red tab. */
  tab: string
  summary: string
  detail: string[]
  /** Pipeline stage names, in the order the demo replays them. */
  stages: string[]
  stack: string[]
  repo: string
  /** When and how the demo's responses were captured. */
  recording: string
}

/** Both projects, keyed by id. */
export const legs: Record<LegId, Leg> = {
  rigrag: {
    id: 'rigrag',
    code: 'Project 01',
    name: 'RigRAG',
    tab: 'PC build recommender',
    summary:
      'Turns a request like "70k gaming PC, 1440p, AMD CPU" into a complete, compatible build priced in Philippine pesos.',
    detail: [
      'Tested Python code over PostgreSQL picks, checks, and prices every part. The language model only reads the request and explains the build, citing sourced hardware notes found through hybrid search in Qdrant.',
    ],
    stages: ['Parse the request', 'Find candidates in SQL', 'Build and score', 'Check compatibility', 'Retrieve notes', 'Explain with citations'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Qdrant', 'Sentence Transformers', 'Groq', 'React', 'TypeScript', 'Docker'],
    repo: 'https://github.com/djmgmz/RigRAG',
    recording: 'Responses recorded on 21 Oct 2026 from the local catalog, with explanations by Groq (gpt-oss-120b).',
  },
  fullcourt: {
    id: 'fullcourt',
    code: 'Project 02',
    name: 'FullCourt',
    tab: 'Hybrid-search NBA AI',
    summary:
      'Answers questions like "efficient scoring guards who can also run an offense" for the 2025-26 NBA season.',
    detail: [
      'SQL supplies exact stats and FAISS searches a style profile for every player, blended 60/40 into one ranking. Explanations use only the evidence each player was given, and a grounding check falls back to a template when one strays.',
    ],
    stages: ['Read the question', 'Statistics lookup', 'Style search', 'Ranking', 'Explanations'],
    stack: ['Python', 'FastAPI', 'SQLite', 'FAISS', 'Sentence Transformers', 'pandas', 'Beautiful Soup', 'Gemini', 'React', 'TypeScript'],
    repo: 'https://github.com/djmgmz/FullCourt',
    recording:
      'Responses recorded on 21 Oct 2026 from the full 2025-26 dataset. Gemini reached its daily quota during recording, so three runs show the app\'s template explanations.',
  },
}

/** Education history, oldest first. */
export const itinerary = [
  {
    leg: '01',
    from: 'DLSU Senior High School',
    to: 'STEM strand',
    dates: '2020 to 2022',
    note: 'Bronze General Excellence Award',
    status: 'Completed',
  },
  {
    leg: '02',
    from: 'De La Salle University Manila',
    to: 'BS Computer Science',
    dates: '2022 to present',
    note: 'Major in Software Technology, minor in Data Science',
    status: 'In progress, 4th year',
  },
]

/** Technical skills by category. The baggage claim shows each tool once, even when listed twice. */
export const skills = [
  { category: 'Languages', items: ['Python', 'TypeScript', 'SQL', 'HTML', 'CSS'] },
  { category: 'Backend', items: ['FastAPI', 'Pydantic', 'SQLAlchemy', 'Alembic', 'Streamlit'] },
  { category: 'Databases and search', items: ['PostgreSQL', 'SQLite', 'Qdrant', 'FAISS'] },
  {
    category: 'ML and data',
    items: ['PyTorch', 'Sentence Transformers', 'Ollama', 'Gemini', 'Groq', 'Anthropic', 'pandas', 'NumPy', 'Beautiful Soup'],
  },
  { category: 'Frontend', items: ['React', 'TypeScript', 'Vite'] },
  { category: 'DevOps and testing', items: ['Docker', 'GitHub Actions', 'pytest', 'ESLint'] },
]

/** Spotify playlists shown as covers in the interests slip. */
export const playlists = [
  { name: 'island', url: 'https://open.spotify.com/playlist/1927SoVPi9COBAl9rOIXFr', image: '/assets/playlist1.jpg' },
  { name: 'time stood still', url: 'https://open.spotify.com/playlist/0FrTnk8JKVKjpfnObDW2sc', image: '/assets/playlist2.jpg' },
  { name: 'powerup', url: 'https://open.spotify.com/playlist/5MW6CjgQdAkxHcDMXc5abS', image: '/assets/playlist3.jpg' },
]

/** Hobby stickers; each shows an emoji or an image above its name. */
export const hobbies: { name: string; emoji?: string; image?: string }[] = [
  { name: 'Music', emoji: '🎧' },
  { name: 'Gaming', emoji: '🎮' },
  { name: 'Films', emoji: '🎬' },
  { name: 'Anime', emoji: '🍥' },
  { name: 'Teamfight Tactics', image: '/assets/teamfighttactics.svg' },
  { name: 'Japanese culture', emoji: '⛩️' },
  { name: 'NewJeans', image: '/assets/newjeansbunny.png' },
]

/** Contact rows, in display order. */
export const contacts = [
  { method: 'Email', handle: 'gomez.dominic.joel@gmail.com', href: 'mailto:gomez.dominic.joel@gmail.com' },
  { method: 'GitHub', handle: 'github.com/djmgmz', href: 'https://github.com/djmgmz' },
  { method: 'LinkedIn', handle: 'linkedin.com/in/djmgmz', href: 'https://www.linkedin.com/in/djmgmz' },
  { method: 'Instagram', handle: 'instagram.com/djmgmz', href: 'https://www.instagram.com/djmgmz' },
  { method: 'Facebook', handle: 'facebook.com/djmgmz', href: 'https://www.facebook.com/djmgmz' },
]

/** Address the contact form's mail draft is sent to. */
export const EMAIL = 'gomez.dominic.joel@gmail.com'
