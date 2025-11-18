import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearchStore } from '../search'

global.fetch = vi.fn()
const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>

describe('search store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockFetch.mockResolvedValue({ json: async () => ({}) })
  })

  it('ingest url', async () => {
    const store = useSearchStore()
    mockFetch.mockResolvedValueOnce({ json: async () => ({ id: 'm1' }) })
    const res = await store.ingestUrl('https://a.com', { density: '入门', subject: '通用', form: '理论' })
    expect(res.id).toBe('m1')
  })

  it('search returns results', async () => {
    const store = useSearchStore()
    mockFetch.mockResolvedValueOnce({ json: async () => ({ results: [{ id: 'r1', rank: 0.8 }] }) })
    const list = await store.search('vue', 'u1', {})
    expect(list.length).toBe(1)
    expect(store.results[0].id).toBe('r1')
  })
})