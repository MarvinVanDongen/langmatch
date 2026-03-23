export type Country = 'ES' | 'PT' | 'MT'
export type Language = 'Spanish' | 'Portuguese' | 'English'
export type CourseType = 'conversational' | 'intensive' | 'general' | 'exam_prep' | 'business' | 'immersive' | 'cultural' | 'holiday'
export type AccommodationType = 'homestay' | 'shared_apartment' | 'residence' | 'studio'
export type CancellationPolicy = 'flexible' | 'standard' | 'strict'
export type RecommendationLabel = 'GO' | 'GOOD FIT' | 'CAUTION' | 'SKIP'
export type PriceBand = 'LOW' | 'FAIR VALUE' | 'PREMIUM' | 'OVERPRICED'

export interface School {
  id: string
  slug: string
  school_name: string
  city: string
  country: Country
  country_name: string
  language: Language
  target_age_min: number
  target_age_max: number
  course_types: CourseType[]
  avg_week_price: number
  accommodation_types: AccommodationType[]
  accommodation_price_week: number
  rating: number
  review_count: number
  accreditation: string[]
  cancellation_policy: CancellationPolicy
  min_duration_weeks: number
  description_short: string
  highlights: string[]
  trade_offs: string[]
  best_for_tags: string[]
  cashback_possible: boolean
  cashback_amount: number
  data_confidence_score: number
  image_url: string
}

export type DestinationParam = 'ES' | 'PT' | 'MT' | 'ANY'
export type GoalParam = 'holiday' | 'fluency' | 'exam' | 'career' | 'gap'
export type DurationParam = 1 | 2 | 3 | 6
export type BudgetParam = 900 | 1500 | 2500 | 9999
export type AgeParam = 21 | 30 | 42 | 55
export type AccomParam = 'school' | 'self' | 'any'

export interface IntakeAnswers {
  destination: DestinationParam
  goal: GoalParam
  duration_weeks: DurationParam
  budget_max: BudgetParam
  age_group: AgeParam
  accommodation_pref: AccomParam
}

export interface ScoredSchool extends School {
  match_score: number
  value_score: number
  trust_score: number
  label: RecommendationLabel
  final_sort_score: number
  price_band: PriceBand
  recommendation_reason: string
}

export const DESTINATION_LABELS: Record<DestinationParam, string> = {
  ES: 'Spain',
  PT: 'Portugal',
  MT: 'Malta',
  ANY: 'Anywhere',
}

export const GOAL_LABELS: Record<GoalParam, string> = {
  holiday: 'Language + holiday',
  fluency: 'Become fluent fast',
  exam: 'Exam preparation',
  career: 'Language for career',
  gap: 'Gap year',
}

export const DURATION_LABELS: Record<DurationParam, string> = {
  1: '1 week',
  2: '2 weeks',
  3: '3–4 weeks',
  6: '6+ weeks',
}

export const BUDGET_LABELS: Record<BudgetParam, string> = {
  900: 'Under €900',
  1500: '€900–€1,500',
  2500: '€1,500–€2,500',
  9999: '€2,500+',
}
