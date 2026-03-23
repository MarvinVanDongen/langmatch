import type { School, ScoredSchool, IntakeAnswers, RecommendationLabel, PriceBand, CourseType } from '@/lib/types'

const GOAL_TO_COURSE_TYPES: Record<string, CourseType[]> = {
  holiday: ['conversational', 'intensive', 'general', 'holiday'],
  fluency: ['intensive', 'immersive', 'general'],
  exam:    ['exam_prep', 'intensive'],
  career:  ['business', 'exam_prep', 'intensive'],
  gap:     ['conversational', 'general', 'cultural', 'holiday'],
}

const CANCEL_SCORES: Record<string, number> = {
  flexible: 100,
  standard: 60,
  strict:   20,
}

function scoreDestination(school: School, dest: string): number {
  if (dest === 'ANY') return 80
  return school.country === dest ? 100 : 0
}

function scoreGoal(school: School, goal: string): number {
  const targets = GOAL_TO_COURSE_TYPES[goal] ?? []
  return school.course_types.some((ct) => targets.includes(ct)) ? 100 : 0
}

function scoreBudget(school: School, answers: IntakeAnswers): number {
  const courseTotal = school.avg_week_price * answers.duration_weeks
  const accomTotal  = answers.accommodation_pref === 'school'
    ? school.accommodation_price_week * answers.duration_weeks
    : 0
  const total = courseTotal + accomTotal
  if (total <= answers.budget_max)        return 100
  if (total <= answers.budget_max * 1.15) return 60
  return 0
}

function scoreAge(school: School, age: number): number {
  if (age >= school.target_age_min && age <= school.target_age_max) return 100
  const closest = Math.min(Math.abs(age - school.target_age_min), Math.abs(age - school.target_age_max))
  return closest <= 5 ? 50 : 0
}

function scoreDuration(school: School, weeks: number): number {
  return weeks >= school.min_duration_weeks ? 100 : 0
}

function scoreAccommodation(school: School, pref: string): number {
  if (pref === 'any' || pref === 'self') return 80
  return school.accommodation_types.length > 0 ? 100 : 30
}

function getMarketAverage(allSchools: School[], country: string, goal: string): number {
  const bucket = allSchools.filter(s =>
    s.country === country &&
    s.course_types.some(ct => (GOAL_TO_COURSE_TYPES[goal] ?? []).includes(ct))
  )
  const src = bucket.length >= 2 ? bucket : allSchools.filter(s => s.country === country)
  if (src.length === 0) return 300
  return src.reduce((sum, s) => sum + s.avg_week_price, 0) / src.length
}

function getPriceBand(ratio: number): PriceBand {
  if (ratio <= 0.85) return 'LOW'
  if (ratio <= 1.05) return 'FAIR VALUE'
  if (ratio <= 1.25) return 'PREMIUM'
  return 'OVERPRICED'
}

function scoreAccreditation(accreditation: string[]): number {
  if (accreditation.length === 0) return 0
  const premium = ['British Council', 'CEELE', 'EAQUALS']
  const hasPremium = accreditation.some(a => premium.includes(a))
  if (hasPremium && accreditation.length >= 2) return 100
  if (hasPremium) return 85
  if (accreditation.length >= 2) return 75
  return 60
}

function generateReason(school: School, answers: IntakeAnswers): string {
  const parts: string[] = []
  const total = school.avg_week_price * answers.duration_weeks +
    (answers.accommodation_pref === 'school' ? school.accommodation_price_week * answers.duration_weeks : 0)

  if (total <= answers.budget_max * 0.9)  parts.push('well within your budget')
  else if (total <= answers.budget_max)   parts.push('fits your budget')

  const targets = GOAL_TO_COURSE_TYPES[answers.goal] ?? []
  if (school.course_types.some(ct => targets.includes(ct))) parts.push('matches your learning goal')
  if (school.review_count >= 100)         parts.push(`${school.review_count}+ verified reviews`)
  if (school.accreditation.length > 0)    parts.push('officially accredited')
  if (school.cancellation_policy === 'flexible') parts.push('flexible cancellation policy')

  if (parts.length === 0) return 'Strong combination of price, location, and quality.'
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  if (parts.length === 1) return `${cap(parts[0])}.`
  if (parts.length === 2) return `${cap(parts[0])} and ${parts[1]}.`
  return `${cap(parts[0])}, with ${parts[1]} and ${parts[2]}.`
}

export function scoreSchool(school: School, answers: IntakeAnswers, allSchools: School[]): ScoredSchool {
  const destinationFit    = scoreDestination(school, answers.destination)
  const goalFit           = scoreGoal(school, answers.goal)
  const budgetFit         = scoreBudget(school, answers)
  const ageFit            = scoreAge(school, answers.age_group)
  const durationFit       = scoreDuration(school, answers.duration_weeks)
  const accommodationFit  = scoreAccommodation(school, answers.accommodation_pref)

  const matchScore = Math.round(
    destinationFit   * 0.25 +
    goalFit          * 0.20 +
    budgetFit        * 0.20 +
    ageFit           * 0.15 +
    durationFit      * 0.10 +
    accommodationFit * 0.10,
  )

  const marketAvg  = getMarketAverage(allSchools, school.country, answers.goal)
  const priceRatio = school.avg_week_price / marketAvg
  let priceScore: number
  if      (priceRatio <= 0.85) priceScore = 100
  else if (priceRatio <= 1.0)  priceScore = 80
  else if (priceRatio <= 1.15) priceScore = 60
  else if (priceRatio <= 1.3)  priceScore = 35
  else                         priceScore = 10

  const valueScore = Math.round(
    priceScore                       * 0.65 +
    (CANCEL_SCORES[school.cancellation_policy] ?? 60) * 0.20 +
    school.data_confidence_score     * 0.15,
  )

  const trustScore = Math.round(
    (school.rating / 5.0) * 100                         * 0.35 +
    Math.min(school.review_count, 200) / 200 * 100       * 0.20 +
    scoreAccreditation(school.accreditation)             * 0.25 +
    school.data_confidence_score                         * 0.20,
  )

  let label: RecommendationLabel
  if      (matchScore >= 75 && trustScore >= 65)               label = 'GO'
  else if (matchScore >= 60 || (matchScore >= 55 && trustScore >= 70)) label = 'GOOD FIT'
  else if (matchScore >= 40 && trustScore >= 50)               label = 'CAUTION'
  else                                                          label = 'SKIP'

  return {
    ...school,
    match_score: matchScore,
    value_score: valueScore,
    trust_score: trustScore,
    label,
    final_sort_score: matchScore * 0.50 + trustScore * 0.30 + valueScore * 0.20,
    price_band: getPriceBand(priceRatio),
    recommendation_reason: generateReason(school, answers),
  }
}

export function getTop3Schools(allSchools: School[], answers: IntakeAnswers): ScoredSchool[] {
  const eligible = answers.destination === 'ANY'
    ? allSchools
    : allSchools.filter(s => s.country === answers.destination)

  const scored = eligible.map(s => scoreSchool(s, answers, allSchools))
  const sorted = [...scored].sort((a, b) => b.final_sort_score - a.final_sort_score)

  const preferred = sorted.filter(s => s.label === 'GO' || s.label === 'GOOD FIT')
  const caution   = sorted.filter(s => s.label === 'CAUTION')
  return [...preferred, ...caution].slice(0, 3)
}

export function parseIntakeFromParams(params: Record<string, string | string[] | undefined>): IntakeAnswers | null {
  const dest = typeof params.dest === 'string' ? params.dest : null
  if (!dest) return null
  return {
    destination:       (dest as IntakeAnswers['destination']) ?? 'ANY',
    goal:              (params.goal as IntakeAnswers['goal']) ?? 'holiday',
    duration_weeks:    (parseInt(String(params.weeks  ?? '2'))  as IntakeAnswers['duration_weeks']) ?? 2,
    budget_max:        (parseInt(String(params.budget ?? '1500')) as IntakeAnswers['budget_max'])  ?? 1500,
    age_group:         (parseInt(String(params.age    ?? '21')) as IntakeAnswers['age_group'])    ?? 21,
    accommodation_pref: (params.acc as IntakeAnswers['accommodation_pref']) ?? 'any',
  }
}

export function buildIntakeParams(answers: IntakeAnswers): string {
  return new URLSearchParams({
    dest:   answers.destination,
    goal:   answers.goal,
    weeks:  String(answers.duration_weeks),
    budget: String(answers.budget_max),
    age:    String(answers.age_group),
    acc:    answers.accommodation_pref,
  }).toString()
}
