// The recorded API responses, trimmed to the fields the demo reads (shapes from WF Market Analyst's
// backend/wfm/api.py).

export interface ItemSummary {
  slug: string
  name: string
  category: string
  image: string | null
  max_rank: number | null
  ducats: number | null
  price: number | null
}

export interface SetPart extends ItemSummary {
  quantity_in_set: number | null
}

export interface Item extends ItemSummary {
  tags: string[]
  description: string | null
  trading_tax: number | null
  req_mastery_rank: number | null
  bulk_tradable: boolean | null
  vaulted: boolean | null
  default_rank: number | null
  recordedOrders: number
  detail_synced_at: string | null
  setItems: SetPart[]
}

export interface DayStat {
  bucket: string
  median: number | null
  volume: number | null
}

export interface History {
  rank: number | null
  closed: DayStat[]
  /** Days left out of prices and volume as likely faked trades. */
  excluded: DayStat[]
  sell: { bucket: string; ask: number | null }[]
}

export interface Forecast {
  horizon: number
  base_date: string
  base_price: number
  predicted: number
  low: number
  high: number
  /** "model" where it beat the no-change baseline for this segment, otherwise "baseline". */
  method: 'model' | 'baseline'
}

export interface Run {
  item: Item
  history: History
  forecast: Forecast[]
  /** Request times in ms on the recording machine. */
  timings: { item: number; history: number; forecast: number }
}

export interface Evaluation {
  n: number
  naive_mae_plat: number
  model_mae_plat: number
  trend_skill: number
  skill: number
  direction: number
  coverage: number
}

export interface Report {
  made_at: string
  last_date: string
  cutoff: string
  test_days: number
  series: number
  horizons: Record<string, {
    train_rows: number
    test_rows: number
    overall: Evaluation
    categories: Record<string, { skill: number; uses_model: boolean }>
  }>
}

export interface Mover {
  rank: number | null
  base_price: number
  predicted: number
  low: number
  high: number
  change: number
  gain: number
  item: ItemSummary
}

export interface Overview {
  items: number
  detailsSynced: number
  primeParts: number
  relicsVaulted: number
  relicsTotal: number
  listSyncedAt: string | null
  ordersTotal: number
  orders24h: number
  itemsWithHistory: number
  statsBackfilledAt: string | null
}

/** A recorded price change: the latest daily median vs 7 days earlier. */
export interface PriceChange {
  rank: number | null
  from: number
  to: number
  change: number
  item: ItemSummary
}

export interface DucatRow extends ItemSummary {
  vaulted: boolean | null
  ducats_per_plat: number | null
}

export interface Recording {
  recordedAt: string
  runs: Run[]
  report: Report
  /** The Forecast page's largest predicted rises. */
  gainers: Mover[]
  overview: Overview
  /** The four biggest recorded rises, then the four biggest falls. */
  movers: PriceChange[]
  /** The four biggest predicted rises, then the four biggest falls. */
  predicted: Mover[]
  /** The best ducats-per-platinum parts, best first. */
  ducats: DucatRow[]
}
