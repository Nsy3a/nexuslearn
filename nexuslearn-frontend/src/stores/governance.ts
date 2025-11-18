import { defineStore } from 'pinia'
import { safeFetchJson } from '../utils/http'
import { getSigner, getGovernorContract } from '../lib/chain'

export const useGovernanceStore = defineStore('governance', {
  state: () => ({ proposals: [] as any[] }),
  actions: {
    async fetchProposals() {
      const res = await safeFetchJson('http://localhost:8080/governance/proposals', undefined, { items: [] })
      this.proposals = res.items || []
    },
    async propose(description: string) {
      const addr = import.meta.env.VITE_GOVERNOR_ADDRESS as string
      if (addr) {
        const signer = await getSigner()
        const gov = getGovernorContract(addr, signer)
        if (gov && typeof gov.propose === 'function') {
          await (await gov.propose([], [], [], description)).wait()
          return { ok: true }
        } else {
          throw new Error('治理合约初始化失败')
        }
      }
      const payload = { targets: [], values: [], calldatas: [], description }
      return safeFetchJson('http://localhost:8080/governance/propose', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, { ok: true })
    },
    async vote(proposalId: string | number, support: number) {
      const addr = import.meta.env.VITE_GOVERNOR_ADDRESS as string
      if (addr) {
        const signer = await getSigner()
        const gov = getGovernorContract(addr, signer)
        if (gov && typeof gov.castVote === 'function') {
          await (await gov.castVote(Number(proposalId), support)).wait()
          return { ok: true }
        } else {
          throw new Error('治理合约初始化失败')
        }
      }
      return safeFetchJson('http://localhost:8080/governance/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ proposalId, support }) }, { ok: true })
    }
  }
})
