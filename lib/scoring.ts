import type {
  School,
  ScoredSchool,
  IntakeAnswers,
  RecommendationLabel,
  PriceBand,
  CourseType,
} from '@/lib/types'

// ─── Goal → Course type mapping ────────────────────────────────────────────

const GOAL_TO_COURSE_TYPES: Record<string, CourseType[]> = {
  holiday: ['conversational', 'intensive', 'general', 'holiday'],
  fluency: ['intensive', 'immersive', 'general'],
  exam: ['exam_prep', 'intensive'],
  career: ['business', 'exam_prep', 'intensive'],
  gap: ['conversational', 'general', 'cultural', 'holiday'],
}

// Cancellation policy → score (0–100)
const CANCEL_SCORES: Record<string, number> = {
  flexible: 100,
  standard: 60,
  strict: 20,
}

// ─── Individual dimension calculators ──────────────────────────────────────

function scoreDestination(school: School, dest: string): number {
  if (dest === 'ANY') return 80
  return school.country === dest ? 100 : 0
}

function scoreGoal(school: School, goal: string): number {
  const targetTypes = GOAL_TO_COURSE_TYPES[goal] ?? []
  const hasMatch = school.course_types.some((ct) => targetTypes.includes(ct))
  return hasMatch ? 100 : 0
}

function scoreBudget(school: School, answers: IntakeAnswers): number {
  const courseTotal = school.avg_week_price * answers.duration_weeks
  const accomTotal =
    answers.accommodation_pref === 'school'
      ? school.accommodation_price_week * answers.duration_weeks
      : 0
  const total = courseTotal + accomTotal

  if (total <= answers.budget_max) return 100
  if (total <= answers.budget_max * 1.15) return 60 // slightly over budget
  return 0
}

function scoreAge(school: School, age: number): number {
  if (age >= school.target_age_min && age <= school.target_age_max) return 100
  // Partial credit for ages close to the range boundary
  const distMin = Math.abs(age - school.target_age_min)
  const distMax = Math.abs(age - school.target_age_max)
  const closest = Math.min(distMin, distMax)
  if (closest <= 5) return 50
  return 0
}

function scoreDuration(school: School, weeks: number): number {
  return weeks >= school.min_duration_weeks ? 100 : 0
}

function scoreAccommodation(school: School, pref: string): number {
  if (pref === 'any') return 80
  if (pref === 'self') return 80 // no penalty for self-arranging
  // User wants school accommodation
  if (school.accommodation_types.length > 0) return 100
  return 30
}

// ─── Market average helper ──────────────────────────────────────────────────

function getMarketAverage(
  allSchools: School[],
  country: string,
  goal: string,
): number {
  const bucket = allSchools.filter(
    (s) =>
      s.country === country &&
      s.course_types.some((ct) =>
        (GOAL_TO_COURSE_TYPES[goal] ?? []).includes(ct),
      ),
  )
  const source = bucket.length >= 2 ? bucket : allSchools.filter((s) => s.country === country)
  if (source.length === 0) return 300 // safe fallback
  return source.reduce((sum, s) => sum + s.avg_week_price, 0) / source.length
}

// ─── Price band label ───────────────────────────────────────────────────────

function getPriceBand(ratio: number): PriceBand {
  if (ratio <= 0.85) return 'LOW'
  if (ratio <= 1.05) return 'FAIR VALUE'
  if (ratio <= 1.25) return 'PREMIUM'
  return 'OVERPRICED'
}

// ─── Accreditation score ────────────────────────────────────────────────────

function scoreAccreditation(accreditation: string[]): number {
  if (accreditation.length === 0) return 0
  const premium = ['British Council', 'CEELE', 'EAQUALS']
  const hasPremium = accreditation.some((a) => premium.includes(a))
  if (hasPremium && accreditation.length >= 2) return 100
  if (hasPremium) return 85
  if (accreditation.length >= 2) return 75
  return 60
}

// ─── Recommendation reason generator ───────────────────────────────────────

function generateReason(school: School, answers: IntakeAnswers): string {
  const parts: string[] = []

  const courseTotal = school.avg_week_price * answers.duration_weeks
  const accomTotal =
    answers.accommodation_pref === 'school'
      ? school.accommodation_price_week * answers.duration_weeks
      : 0
  const total = courseTotal + accomTotal

  if (total <= answers.budget_max * 0.9) {
    parts.push('ruim binnen je budget')
  } else if (total <= answers.budget_max) {
    parts.push('past binnen je budget')
  }

  const targetTypes = GOAL_TO_COURSE_TYPES[answers.goal] ?? []
  if (school.course_types.some((ct) => targetTypes.includes(ct))) {
    parts.push('sluit aan bij je leerdoel')
  }

  if (school.review_count >= 100) {
    parts.push(`${school.review_count}+ beoordelingen`)
  }

  if (school.accreditation.length > 0) {
    parts.push('officieel geaccrediteerd')
  }

  if (school.cancellation_policy === 'flexible') {
    parts.push('flexibel annuleringsbeleid')
  }

  if (parts.length === 0) return 'Goede combinatie van prijs, locatie en kwaliteit.'

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  if (parts.length === 1) return `${cap(parts[0])}.`
  if (parts.length === 2) return `${cap(parts[0])} en ${parts[1]}.`
  return `${cap(parts[0])}, met ${parts[1]} en ${parts[2]}.`
}

// ─── Main scoring function ──────────────────────────────────────────────────

export function scoreSchool(
  school: School,
  answers: IntakeAnswers,
  allSchools: School[],
): ScoredSchool {
  // ── Match Score (0–100) ─────────────────────────────────────────

  const destinationFit = scoreDestination(school, answers.destination)
  const goalFit = scoreGoal(school, answers.goal)
  const budgetFit = scoreBudget(school, answers)
  const ageFit = scoreAge(school, answers.age_group)
  const durationFit = scoreDuration(school, answers.duration_weeks)
  const accommodationFit = scoreAccommodation(school, answers.accommodation_pref)

  const matchScore = Math.round(
    destinationFit * 0.25 +
      goalFit * 0.20 +
      budgetFit * 0.20 +
      ageFit * 0.15 +
      durationFit * 0.10 +
      accommodationFit * 0.10,
  )

  // ── Value Score (0–100) ─────────────────────────────────────────

  const marketAvg = getMarketAverage(allSchools, school.country, answers.goal)
  const priceRatio = school.avg_week_price / marketAvg

  let priceScore: number
  if (priceRatio <= 0.85) priceScore = 100
  else if (priceRatio <= 1.0) priceScore = 80
  else if (priceRatio <= 1.15) priceScore = 60
  else if (priceRatio <= 1.3) priceScore = 35
  else priceScore = 10

  const cancelScore = CANCEL_SCORES[school.cancellation_policy] ?? 60

  const valueScore = Math.round(
    priceScore * 0.65 +
      cancelScore * 0.20 +
      school.data_confidence_score * 0.15,
  )

  // ── Trust Score (0–100) ─────────────────────────────────────────

  const reviewScoreNorm = (school.rating / 5.0) * 100
  const reviewVolNorm = Math.min(school.review_count, 200) / 200 * 100
  const accredScore = scoreAccreditation(school.accreditation)

  const trustScore = Math.round(
    reviewScoreNorm * 0.35 +
      reviewVolNorm * 0.20 +
      accredScore * 0.25 +
      school.data_confidence_score * 0.20,
  )

  // ── Recommendation label ────────────────────────────────────────

  let label: RecommendationLabel
  if (matchScore >= 75 && trustScore >= 65) {
    label = 'GO'
  } else if (matchScore >= 60 || (matchScore >= 55 && trustScore >= 70)) {
    label = 'GOOD FIT'
  } else if (matchScore >= 40 && trustScore >= 50) {
    label = 'CAUTION'
  } else {
    label = 'SKIP'
  }

  // ── Final sort score: 50% match, 30% trust, 20% value ──────────

  const finalSortScore =
    matchScore * 0.50 + trustScore * 0.30 + valueScore * 0.20

  // ── Price band ──────────────────────────────────────────────────

  const priceBand = getPriceBand(priceRatio)

  // ── Reason text ─────────────────────────────────────────────────

  const recommendationReason = generateReason(school, answers)

  return {
    ...school,
    match_score: matchScore,
    value_score: valueScore,
    trust_score: trustScore,
    label,
    final_sort_score: finalSortScore,
    price_band: priceBand,
    recommendation_reason: recommendationReason,
  }
}

// ─── Get top 3 schools ──────────────────────────────────────────────────────

export function getTop3Schools(
  allSchools: School[],
  answers: IntakeAnswers,
): ScoredSchool[] {
  // Hard-filter by destination (unless ANY is selected)
  const eligible =
    answers.destination === 'ANY'
      ? allSchools
      : allSchools.filter((s) => s.country === answers.destination)

  // Score every eligible school
  const scored = eligible.map((school) => scoreSchool(school, answers, allSchools))

  // Sort by final sort score descending
  const sorted = [...scored].sort((a, b) => b.final_sort_score - a.final_sort_score)

  // Prefer GO and GOOD FIT; fall back to CAUTION if not enough
  const preferred = sorted.filter((s) => s.label === 'GO' || s.label === 'GOOD FIT')
  const caution = sorted.filter((s) => s.label === 'CAUTION')

  const combined = [...preferred, ...caution]
  return combined.slice(0, 3)
}

// ─── Parse intake answers from URL search params ────────────────────────────

export function parseIntakeFromParams(
  params: Record<string, string | string[] | undefined>,
): IntakeAnswers | null {
  const dest = typeof params.dest === 'string' ? params.dest : null
  if (!dest) return null

  return {
    destination: (dest as IntakeAnswers['destination']) ?? 'ANY',
    goal: (params.goal as IntakeAnswers['goal']) ?? 'holiday',
    duration_weeks: (parseInt(String(params.weeks ?? '2')) as IntakeAnswers['duration_weeks']) ?? 2,
    budget_max: (parseInt(String(params.budget ?? '1500')) as IntakeAnswers['budget_max']) ?? 1500,
    age_group: (parseInt(String(params.age ?? '21')) as IntakeAnswers['age_group']) ?? 21,
    accommodation_pref: (params.acc as IntakeAnswers['accommodation_pref']) ?? 'any',
  }
}

// Build URL param string from intake answers
export function buildIntakeParams(answers: IntakeAnswers): string {
  const p = new URLSearchParams({
    dest: answers.destination,
    goal: answers.goal,
    weeks: String(answers.duration_weeks),
    budget: String(answers.budget_max),
    age: String(answers.age_group),
    acc: answers.accommodation_pref,
  })
  return p.toString()
}
