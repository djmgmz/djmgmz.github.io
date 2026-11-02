/** Identifies a project; also used as its section id and nav anchor. */
export type ProjectId = 'rigrag' | 'fullcourt' | 'wfm'

/** Name, credentials and intro shown in the header, hero and about section. */
export const profile = {
  name: 'Dominic Gomez',
  fullName: 'Dominic Joel M. Gomez',
  role: 'Full-stack developer',
  photo: '/assets/profilephoto.jpg',
  /** One sentence per line, so a line never breaks in the middle of a sentence. */
  headline: ['Hi, I’m Dominic.', 'I build full-stack apps.'],
  lede:
    'I’m a 4th-year Computer Science student at De La Salle University in Manila. You can try three of my projects below, right in your browser.',
  aboutTitle: 'About me',
  about: [
    'I like building things from start to finish: the database, the backend, the interface and the tests. Most of my projects start as something I got curious about and couldn’t stop thinking about.',
    'Lately I’ve been working with AI. In my projects, regular code does the searching, ranking and pricing, and the language model explains the results and cites where its information came from.',
  ],
}

/** The page's sections in reading order, as the side navigation lists them. */
export const sections = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About me' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'interests', label: 'Interests' },
  { id: 'faq', label: 'Questions' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof sections)[number]['id']

/** The figures in the about section. Each one must stay literally true. */
export const numbers = [
  { value: '3', label: 'projects you can run on this page' },
  { value: '30+', label: 'tools and libraries I build with' },
  { value: '4th', label: 'year of BS Computer Science' },
  { value: '0', label: 'servers or API keys needed to try them' },
]

/** One project's card copy. */
export interface Project {
  id: ProjectId
  name: string
  /** What it does, in one sentence, after the "What it does:" lead. */
  summary: string
  /** Pipeline stage names, in the order the demo replays them. */
  stages: string[]
  stack: string[]
  repo: string
  /** When and how the demo's responses were captured. */
  recording: string
  /** Screenshot of the real app, shown in the about strip. */
  shot: string
  /** Cards on the dark ground match an app that is itself dark. */
  dark?: boolean
}

/** All three projects, keyed by id, in page order. */
export const projects: Record<ProjectId, Project> = {
  rigrag: {
    id: 'rigrag',
    name: 'RigRAG',
    summary: 'turns “70k gaming PC, 1440p, AMD CPU” into a complete, compatible build priced in Philippine pesos.',
    stages: ['Parse the request', 'Find candidates in SQL', 'Build and score', 'Check compatibility', 'Retrieve notes', 'Explain with citations'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Qdrant', 'Sentence Transformers', 'Groq', 'React', 'TypeScript', 'Docker'],
    repo: 'https://github.com/djmgmz/RigRAG',
    recording: 'Responses recorded on 21 Oct 2026 from the local catalog, with explanations by Groq (gpt-oss-120b).',
    shot: '/assets/shots/rigrag.jpg',
  },
  fullcourt: {
    id: 'fullcourt',
    name: 'FullCourt',
    summary: 'answers “efficient scoring guards who can also run an offense” for the 2025-26 NBA season.',
    stages: ['Read the question', 'Statistics lookup', 'Style search', 'Ranking', 'Explanations'],
    stack: ['Python', 'FastAPI', 'SQLite', 'FAISS', 'Sentence Transformers', 'pandas', 'Beautiful Soup', 'Gemini', 'React', 'TypeScript'],
    repo: 'https://github.com/djmgmz/FullCourt',
    recording:
      'Responses recorded on 21 Oct 2026 from the full 2025-26 dataset. Gemini reached its daily quota during recording, so three runs show the app’s template explanations.',
    shot: '/assets/shots/fullcourt.jpg',
  },
  wfm: {
    id: 'wfm',
    name: 'WF Market Analyst',
    summary: 'tracks Warframe’s player market over time and forecasts next week’s average price for every item.',
    stages: ['Read 90 days of trades', 'Leave out faked trades', 'Forecast the next 7 days', 'Check against no change', 'Chart price and volume'],
    stack: ['Python', 'FastAPI', 'SQLite', 'LightGBM', 'httpx', 'Angular', 'TypeScript'],
    repo: 'https://github.com/djmgmz/WFMarketAnalyst',
    recording: 'Responses recorded on 1 Nov 2026 from the local database of warframe.market’s public API.',
    shot: '/assets/shots/wfm.jpg',
    dark: true,
  },
}

/** Education, oldest first. */
export const education = [
  { title: 'STEM strand', school: 'DLSU Senior High School', dates: '2020 to 2022', note: 'Bronze General Excellence Award.' },
  {
    title: 'BS Computer Science',
    school: 'De La Salle University Manila',
    dates: '2022 to present',
    note: 'Software Technology major, Data Science minor. 4th year.',
  },
]

/** Technical skills by category. */
export const skills = [
  { category: 'Languages', items: ['Python', 'TypeScript', 'SQL', 'HTML', 'CSS'] },
  { category: 'Backend', items: ['FastAPI', 'Pydantic', 'SQLAlchemy', 'Alembic', 'Streamlit'] },
  { category: 'Databases and search', items: ['PostgreSQL', 'SQLite', 'Qdrant', 'FAISS'] },
  {
    category: 'ML and data',
    items: ['PyTorch', 'Sentence Transformers', 'LightGBM', 'Ollama', 'Gemini', 'Groq', 'Anthropic', 'pandas', 'NumPy', 'Beautiful Soup'],
  },
  { category: 'Frontend', items: ['React', 'Angular', 'TypeScript', 'Vite'] },
  { category: 'DevOps and testing', items: ['Docker', 'GitHub Actions', 'pytest', 'ESLint'] },
]

/** Tools shown as marks under the hero, the way client logos sit under a studio's headline. */
export const toolStrip = ['Python', 'TypeScript', 'FastAPI', 'PostgreSQL', 'SQLite', 'React', 'Angular', 'Docker', 'PyTorch', 'Qdrant']

/** Spotify playlists shown as covers in the interests section. */
export const playlists = [
  { name: 'island', url: 'https://open.spotify.com/playlist/1927SoVPi9COBAl9rOIXFr', image: '/assets/playlist1.jpg' },
  { name: 'time stood still', url: 'https://open.spotify.com/playlist/0FrTnk8JKVKjpfnObDW2sc', image: '/assets/playlist2.jpg' },
  { name: 'powerup', url: 'https://open.spotify.com/playlist/5MW6CjgQdAkxHcDMXc5abS', image: '/assets/playlist3.jpg' },
]

/** Hobby bubbles; each shows an emoji or an image above its name. */
export const hobbies: { name: string; emoji?: string; image?: string }[] = [
  { name: 'Music', emoji: '🎧' },
  { name: 'Gaming', emoji: '🎮' },
  { name: 'Films', emoji: '🎬' },
  { name: 'Anime', emoji: '🍥' },
  { name: 'Teamfight Tactics', image: '/assets/teamfighttactics.svg' },
  { name: 'Japanese culture', emoji: '⛩️' },
  { name: 'NewJeans', image: '/assets/newjeansbunny.png' },
]

/** Questions a recruiter is likely to ask, answered plainly. */
export const faq = [
  {
    q: 'Are the demos real?',
    a: 'Yes. Each one replays responses recorded from the project’s own backend, in the project’s own interface. Only the recorded requests can be answered; anything else points to the repository.',
  },
  {
    q: 'Why recorded instead of live?',
    a: 'The backends need databases and model API keys. Recording keeps this page fast and free to run while showing exactly what each app returned.',
  },
  { q: 'Can I see the code?', a: 'Every project links to its GitHub repository, with setup steps to run it yourself.' },
  { q: 'What roles are you looking for?', a: 'Internships and junior roles in full-stack or ML engineering.' },
]

/** Contact rows, in display order. */
export const contacts = [
  { method: 'Email', handle: 'gomez.dominic.joel@gmail.com', href: 'mailto:gomez.dominic.joel@gmail.com' },
  { method: 'GitHub', handle: 'djmgmz', href: 'https://github.com/djmgmz' },
  { method: 'LinkedIn', handle: 'in/dominic-joel-gomez', href: 'https://www.linkedin.com/in/dominic-joel-gomez-379220265/' },
  { method: 'Instagram', handle: '@djmgmz', href: 'https://www.instagram.com/djmgmz' },
  { method: 'Facebook', handle: 'djmgmz', href: 'https://www.facebook.com/djmgmz' },
]

/** Address the contact form's mail draft is sent to. */
export const EMAIL = 'gomez.dominic.joel@gmail.com'
