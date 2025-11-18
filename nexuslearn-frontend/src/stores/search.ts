import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface MaterialItem {
  id: string
  url?: string
  filename?: string
  tags: { density: string; subject: string; form: string }
  qualityScore: number
  ipfsHash: string
}

export const useSearchStore = defineStore('search', () => {
  const materials = ref<MaterialItem[]>([])
  const results = ref<any[]>([])

  async function ingestUrl(url: string, tags: { density: string; subject: string; form: string }) {
    const res = await fetch('http://localhost:8080/ingest/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, tags })
    }).then(r => r.json())
    return res
  }

  async function uploadFile(name: string, base64: string, tags: { density: string; subject: string; form: string }) {
    const res = await fetch('http://localhost:8080/ingest/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: name, contentBase64: base64, tags })
    }).then(r => r.json())
    return res
  }

  async function listMaterials() {
    const res = await fetch('http://localhost:8080/materials').then(r => r.json())
    materials.value = res.items || []
    return materials.value
  }

  async function search(q: string, userId: string, filters: any = {}) {
    const params = new URLSearchParams({ q, userId, filters: JSON.stringify(filters) })
    const res = await fetch('http://localhost:8080/search?' + params.toString()).then(r => r.json())
    results.value = res.results || []
    return results.value
  }

  return { materials, results, ingestUrl, uploadFile, listMaterials, search }
})