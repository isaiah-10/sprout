export type SubscriptionStatus = 'free_trial' | 'active' | 'past_due' | 'cancelled'
export type SubscriptionPlan = 'solo' | 'family'
export type ApprovalMode = 'all' | 'self'
export type TradeType = 'buy' | 'sell'
export type TradeStatus = 'pending' | 'approved' | 'denied' | 'expired'
export type AssetType = 'stock' | 'etf' | 'index_fund' | 'reit' | 'crypto'
export type AllowanceFrequency = 'weekly' | 'biweekly' | 'monthly'
export type CurrencyType = 'seeds' | 'real'
export type AgeGroup = 'young' | 'middle' | 'teen' | 'older_teen'
  // young: 5-8, middle: 9-12, teen: 13-16, older_teen: 17-18

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  subscription_status: SubscriptionStatus
  subscription_plan: SubscriptionPlan | null
  subscription_end_at: string | null
  trial_end_at: string | null
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface ChildProfile {
  id: string
  parent_id: string
  name: string
  date_of_birth: string
  avatar_emoji: string
  color: string
  pin_hash: string | null
  auth_user_id: string | null
  approval_mode: ApprovalMode
  monthly_invest_limit: number | null
  virtual_balance: number
  real_balance: number
  real_balance_pending: number
  xp: number
  streak_days: number
  longest_streak: number
  last_activity_date: string | null
  created_at: string
  updated_at: string
  // computed (not in DB)
  age?: number
  age_group?: AgeGroup
}

export interface VirtualHolding {
  id: string
  child_id: string
  symbol: string
  company_name: string
  shares: number
  avg_buy_price: number
  created_at: string
  updated_at: string
  // computed from live price
  current_price?: number
  current_value?: number
  gain_loss?: number
  gain_loss_pct?: number
}

export interface VirtualTransaction {
  id: string
  child_id: string
  symbol: string
  company_name: string
  type: 'buy' | 'sell' | 'game_reward' | 'task_reward' | 'starting_balance'
  shares: number | null
  price_per_share: number | null
  total_amount: number
  note: string | null
  executed_at: string
}

export interface RealHolding {
  id: string
  child_id: string
  symbol: string
  company_name: string
  asset_type: AssetType
  shares: number
  avg_buy_price: number
  created_at: string
  updated_at: string
  current_price?: number
  current_value?: number
  gain_loss?: number
  gain_loss_pct?: number
}

export interface TradeRequest {
  id: string
  child_id: string
  parent_id: string
  symbol: string
  company_name: string
  asset_type: AssetType
  trade_type: TradeType
  shares: number
  estimated_price: number
  total_estimated: number
  status: TradeStatus
  kid_note: string | null
  parent_note: string | null
  created_at: string
  reviewed_at: string | null
  expires_at: string
  // joined
  child?: Pick<ChildProfile, 'id' | 'name' | 'avatar_emoji' | 'color'>
}

export interface SavingsGoal {
  id: string
  child_id: string
  title: string
  emoji: string
  target_amount: number
  current_amount: number
  completed: boolean
  completed_at: string | null
  created_at: string
}

export interface Allowance {
  id: string
  child_id: string
  parent_id: string
  amount: number
  currency_type: CurrencyType
  frequency: AllowanceFrequency
  next_payment_date: string
  active: boolean
  created_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  xp_reward: number
  category: string
  min_age: number
  max_age: number
}

export interface ChildAchievement {
  id: string
  child_id: string
  achievement_id: string
  earned_at: string
  achievement?: Achievement
}

export interface GameSession {
  id: string
  child_id: string
  game_slug: string
  score: number
  seeds_earned: number
  xp_earned: number
  completed: boolean
  played_at: string
}

export interface ActivityLogEntry {
  id: string
  child_id: string
  parent_id: string
  type: string
  title: string
  description: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  child?: Pick<ChildProfile, 'id' | 'name' | 'avatar_emoji' | 'color'>
}

export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  change_pct: number
  volume: number
  market_cap?: number
  pe_ratio?: number
  high_52w?: number
  low_52w?: number
}

export interface StockHistoryPoint {
  date: string
  close: number
  open: number
  high: number
  low: number
  volume: number
}
