// Subset of RigRAG's API types (frontend/src/api.ts) that the recorded runs carry.

export type Severity = 'blocking' | 'warning' | 'info'

export interface CompatibilityResult {
  rule: string
  compatible: boolean
  severity: Severity
  message: string
}

export type Part = Record<string, unknown> & {
  id: string
  category: string
  manufacturer: string
  model: string
  price_php: number | string | null
  price_type?: string
  url?: string | null
  owned?: boolean
}

export interface BuildComponents {
  cpu: Part
  motherboard: Part
  ram: Part
  storage: Part[]
  psu: Part
  cooler: Part
  case: Part
  gpu: Part | null
}

export interface ScoredBuild {
  label: string
  components: BuildComponents
  score: { total_price_php: number }
  compatibility: CompatibilityResult[]
}

export interface BuildResult {
  primary: ScoredBuild
  alternatives: ScoredBuild[]
}

export interface BuildRequest {
  budget_php: number
  use_case: string[]
  resolution: string | null
  cpu_brand: string | null
  gpu_brand: string | null
  wifi_required: boolean
  small_form_factor: boolean
  quiet: boolean
  low_power: boolean
  prioritize_upgradeability: boolean
}

export interface CitedNote {
  ref: number
  note_id: string
  title: string
  checked: string
}

/** One /api/chat response captured from the real backend, plus how long it took. */
export interface RecordedRun {
  recordedSeconds: number
  reply: string
  state: BuildRequest
  build: BuildResult
  sources: CitedNote[]
}
