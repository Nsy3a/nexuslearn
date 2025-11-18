import { defineStore } from 'pinia'
import { ref } from 'vue'
import { safeFetchJson } from '../utils/http'

type Difficulty = '低' | '中' | '高'
interface AssessResponse { nextDifficulty?: Difficulty }
interface StartSessionResponse { sessionId: string; questions: any[] }
interface SubmitResponse { nextDifficulty?: Difficulty; score?: number; correctRate?: number }

export interface LearningState {
  userId: string
  goal: string
  skills: string[]
  plan: any[]
  progress: number
  masteryScore: number
}

export const useLearningStore = defineStore('learning', () => {
  const userId = ref('u1')
  const goal = ref('')
  const skills = ref<string[]>([])
  const plan = ref<any[]>([])
  const progress = ref<any[]>([])
  const masteryScore = ref(0)

  async function createGoal(payload: { goal: string; skills: string[] }) {
    const res = await safeFetchJson('http://localhost:8081/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId.value, ...payload })
    }, { goal: payload.goal, skills: payload.skills })
    goal.value = res.goal
    skills.value = res.skills
    return res
  }

  async function generatePlan(days = 7) {
    const res = await safeFetchJson('http://localhost:8081/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId.value, timeBudgetDays: days, skills: skills.value })
    }, { schedule: [] })
    plan.value = res.schedule || []
    return res
  }

  async function fetchProgress() {
    const res = await safeFetchJson(`http://localhost:8081/progress/${userId.value}`, undefined, { progress: [], masteryScore: 0 })
    progress.value = res.progress || []
    masteryScore.value = res.masteryScore || 0
    return res
  }

  async function assess(correctRate: number, speed = 1): Promise<AssessResponse> {
    const res = await safeFetchJson<AssessResponse>('http://localhost:8081/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId.value, correctRate, speed })
    }, {})
    await fetchProgress()
    return res
  }

  async function startSession(topic: string, difficulty: Difficulty): Promise<StartSessionResponse> {
    const res = await safeFetchJson<StartSessionResponse>('http://localhost:8081/learn/session/start', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId.value, topic, difficulty })
    }, { sessionId: 'mock', questions: [] })
    return res
  }

  async function submitSession(sessionId: string, answers: number[], speed = 1): Promise<SubmitResponse> {
    const res = await safeFetchJson<SubmitResponse>('http://localhost:8081/learn/session/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answers, speed })
    }, {})
    await fetchProgress()
    return res
  }

  async function fetchReinforcement() {
    const res = await safeFetchJson(`http://localhost:8081/learn/reinforcement/${userId.value}`, undefined, { items: [] })
    return res
  }

  return { userId, goal, skills, plan, progress, masteryScore, createGoal, generatePlan, fetchProgress, assess, startSession, submitSession, fetchReinforcement }
})