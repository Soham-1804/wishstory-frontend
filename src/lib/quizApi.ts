import api from '@/lib/api'
import type { Answer, QuizSession, QuizResult } from '@/types/quiz'

export const quizApi = {

  // Partner 1 starts a new quiz
  start: async (partner1Name: string, partner2Name: string): Promise<{ quizId: string; questionIds: string[] }> => {
    const { data } = await api.post('/quiz/start', { partner1Name, partner2Name })
    return data
  },

  // Load session info (both partners call this to get question IDs + status)
  getSession: async (quizId: string): Promise<QuizSession> => {
    const { data } = await api.get(`/quiz/${quizId}`)
    return { ...data, quizId: data.quizId || quizId }
  },

  // Submit answers — partner: 1 or 2
  submit: async (quizId: string, partner: 1 | 2, answers: Answer[]): Promise<{ bothCompleted: boolean; quizId: string }> => {
    const { data } = await api.post(`/quiz/${quizId}/submit`, { partner, answers })
    return data
  },

  // Get final result (only works when both partners have submitted)
  getResult: async (quizId: string): Promise<QuizResult> => {
    const { data } = await api.get(`/quiz/${quizId}/result`)
    return data
  },
}
