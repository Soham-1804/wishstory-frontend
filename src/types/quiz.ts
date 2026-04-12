export type QuestionCategory = 'loveLanguage' | 'lifestyle' | 'futureGoals' | 'dailyHabits' | 'personality'

export interface QuestionOption {
  label: string
  value: string
}

export interface Question {
  id: string
  category: QuestionCategory
  type: 'choice' | 'slider'
  question: string
  options?: QuestionOption[]      // choice questions
  leftLabel?: string              // slider questions
  rightLabel?: string             // slider questions
}

export interface Answer {
  questionId: string
  value: string | number
}

export interface CategoryScores {
  loveLanguage: number
  lifestyle: number
  futureGoals: number
  dailyHabits: number
  personality: number
}

export interface QuizSession {
  quizId: string
  partner1Name: string
  partner2Name: string
  questionIds: string[]
  partner1Completed: boolean
  partner2Completed: boolean
  score: number | null
  categoryScores: CategoryScores | null
  scoreLabel: string | null
  expiresAt: string
}

export interface QuizResult {
  partner1Name: string
  partner2Name: string
  score: number
  categoryScores: CategoryScores
  scoreLabel: string
}

export const SCORE_TIERS = [
  {
    min: 90, label: 'Soul Mates',
    emoji: '💫',
    description: 'You two were written in the stars. This kind of connection is rare and beautiful.',
    color: '#7F77DD',
  },
  {
    min: 75, label: 'Perfect Pair',
    emoji: '💑',
    description: 'Deeply aligned where it matters most. A few delightful differences keep things exciting.',
    color: '#1D9E75',
  },
  {
    min: 60, label: 'Great Match',
    emoji: '💛',
    description: 'You have a solid foundation. Some things to discover and grow together.',
    color: '#EF9F27',
  },
  {
    min: 45, label: 'Almost There',
    emoji: '🌱',
    description: 'You clearly vibe, but you have some blind spots worth exploring together!',
    color: '#D85A30',
  },
  {
    min: 0, label: 'Opposites Attract',
    emoji: '⚡',
    description: 'Your differences balance each other out beautifully. Opposites can be a strength.',
    color: '#D4537E',
  },
] as const

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  loveLanguage: 'Love Language',
  lifestyle:    'Lifestyle',
  futureGoals:  'Future Goals',
  dailyHabits:  'Daily Habits',
  personality:  'Personality',
}
