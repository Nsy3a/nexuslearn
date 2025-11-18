import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLearningStore } from '../learning'

global.fetch = vi.fn()
const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>

describe('learning store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockFetch.mockResolvedValue({ json: async () => ({}) })
  })

  it('creates goal', async () => {
    const store = useLearningStore()
    mockFetch.mockResolvedValueOnce({ json: async () => ({ goal: 'CPA', skills: ['A','B'] }) })
    await store.createGoal({ goal: 'CPA', skills: ['A','B'] })
    expect(store.goal).toBe('CPA')
    expect(store.skills).toEqual(['A','B'])
  })

  it('generates plan', async () => {
    const store = useLearningStore()
    mockFetch.mockResolvedValueOnce({ json: async () => ({ schedule: [{day:1,topic:'T'}] }) })
    await store.generatePlan(3)
    expect(store.plan.length).toBe(1)
  })

  it('assess updates mastery', async () => {
    const store = useLearningStore()
    mockFetch.mockResolvedValueOnce({ json: async () => ({ masteryScore: 85 }) })
    await store.assess(0.9)
    expect(store.masteryScore).toBe(85)
  })
})
