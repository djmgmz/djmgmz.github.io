// Ported from FullCourt's frontend/src/api.ts: the types only, since the demo replays recorded responses.
export type Method = 'hybrid' | 'stats' | 'semantic'
export type MissingPolicy = 'zero' | 'neutral'

export interface Meta {
  seasons: string[]
  default_season: string
  methods: { value: Method; label: string }[]
  examples: string[]
  defaults: {
    min_games: number
    min_minutes: number
    stat_weight: number
    missing_semantic_policy: MissingPolicy
  }
  llm: { available: boolean; status: string }
  index_size: number
}

export interface SearchSettings {
  method: Method
  season: string
  useEligibility: boolean
  statWeight: number
  missingPolicy: MissingPolicy
}

export interface KeyStat {
  metric: string
  label: string
  value: string
}

export interface GoalMetric {
  label: string
  value: string
  pool_rank: string
}

export interface Goal {
  label: string
  score: number | null
  proxy_note: string | null
  metrics: GoalMetric[]
}

export interface Passage {
  document_id: string
  text: string
  source_name: string
  source_url: string
  source_section: string | null
  description_type: string
  is_stat_profile: boolean
  license: string | null
  published_at: string | null
}

export interface PlayerResult {
  rank: number
  player_id: string
  player_name: string
  position: string | null
  team: string | null
  teams: string | null
  season: string
  games: string
  key_stats: KeyStat[]
  score: {
    final: number
    stat_fit: number | null
    style_match: number | null
    style_missing: boolean
    components_used: string[]
    stat_contribution: number
    style_contribution: number
  }
  goals: Goal[]
  explanation: { text: string; source: 'llm' | 'template'; grounding_issues: string[] } | null
  passages: Passage[]
  stats_source: { name: string; tables: { label: string; url: string }[] }
}

export interface SearchResponse {
  summary: {
    method: Method
    method_label: string
    season: string
    season_was_defaulted: boolean
    parser: 'llm' | 'rules'
    candidate_count: number
    eligibility_applied: boolean
  }
  plan: Record<string, unknown>
  messages: string[]
  warnings: string[]
  unsupported: string[]
  timings_ms: Record<string, number>
  results: PlayerResult[]
}

/** One /api/search response captured from the real backend, with the question that produced it. */
export interface RecordedRun extends SearchResponse {
  question: string
}
