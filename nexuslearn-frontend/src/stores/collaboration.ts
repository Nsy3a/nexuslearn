import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Demand {
  id: string
  title: string
  description: string
  techStack: string[]
  budgetStablecoin: number
  status: string
  tasks: any[]
  createdAt?: number
}

export interface Answer {
  id: string
  demandId: string
  contributor: string
  contentUri: string
  quality: number
}

export interface NFT {
  nftId: string
  demandId: string
  contentHash: string
  summary: string
  contributors: { address: string; share: number }[]
  ownership: string
  createdAt: number
}

export const useCollaborationStore = defineStore('collaboration', () => {
  const demands = ref<Demand[]>([])
  const answers = ref<Answer[]>([])
  const nfts = ref<NFT[]>([])
  const currentDemandId = ref('')

  async function createDemand(payload: { title: string; description: string; techStack: string[]; budgetStablecoin: number }) {
    const res = await fetch('http://localhost:8081/demands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json())
    demands.value.push(res.demand)
    currentDemandId.value = res.demand.id
    return res
  }

  async function submitAnswer(demandId: string, contributor: string, contentUri: string, quality = 0.8) {
    const res = await fetch('http://localhost:8081/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandId, contributor, contentUri, quality })
    }).then(r => r.json())
    answers.value.push(res)
    return res
  }

  async function acceptDemand(demandId: string, contributions: { address: string; share: number }[], contentHash: string, summary: string) {
    const res = await fetch('http://localhost:8081/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demandId, contributions, contentHash, summary })
    }).then(r => r.json())
    if (res.nft) nfts.value.push(res.nft)
    return res
  }

  async function listNFTs() {
    const res = await fetch('http://localhost:8081/nfts').then(r => r.json())
    nfts.value = res.items || []
    return nfts.value
  }

  async function addTask(demandId: string, title: string, skills: string[]) {
    const res = await fetch(`http://localhost:8081/demands/${demandId}/tasks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, skills })
    }).then(r => r.json())
    const d = demands.value.find(x => x.id === demandId)
    if (d) {
      d.tasks = d.tasks || []
      d.tasks.push(res)
    }
    return res
  }

  async function updateTask(demandId: string, taskId: string, payload: { status?: string; title?: string; skills?: string[] }) {
    const res = await fetch(`http://localhost:8081/demands/${demandId}/tasks/${taskId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json())
    return res
  }

  async function fetchTasks(demandId: string) {
    const res = await fetch(`http://localhost:8081/demands/${demandId}/tasks`).then(r => r.json())
    const d = demands.value.find(x => x.id === demandId)
    if (d) d.tasks = res.items || []
    return res.items || []
  }

  async function reorderTask(demandId: string, taskId: string, toStatus: string, toIndex: number) {
    const res = await fetch(`http://localhost:8081/demands/${demandId}/tasks/reorder`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, toStatus, toIndex })
    }).then(r => r.json())
    await fetchTasks(demandId)
    return res
  }

  async function assignTask(demandId: string, taskId: string, assignee: string) {
    const res = await fetch(`http://localhost:8081/demands/${demandId}/tasks/assign`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, assignee })
    }).then(r => r.json())
    await fetchTasks(demandId)
    return res
  }

  async function setDependencies(demandId: string, taskId: string, dependsOn: string[]) {
    const res = await fetch(`http://localhost:8081/demands/${demandId}/tasks/dependency`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, dependsOn })
    }).then(r => r.json())
    await fetchTasks(demandId)
    return res
  }

  async function setMilestone(demandId: string, taskId: string, dueDate: string, milestone: string) {
    const res = await fetch(`http://localhost:8081/demands/${demandId}/tasks/milestone`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, dueDate, milestone })
    }).then(r => r.json())
    await fetchTasks(demandId)
    return res
  }

  function setCurrentDemand(id: string) {
    currentDemandId.value = id
  }

  return { demands, answers, nfts, currentDemandId, createDemand, submitAnswer, acceptDemand, listNFTs, addTask, updateTask, fetchTasks, reorderTask, assignTask, setDependencies, setMilestone, setCurrentDemand }
})