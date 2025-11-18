import { defineStore } from 'pinia'

declare global { interface Window { ethereum?: any } }

export const useWalletStore = defineStore('wallet', {
  state: () => ({ address: '' as string }),
  actions: {
    async connect() {
      if (!window.ethereum) throw new Error('No wallet')
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      this.address = accounts[0]
      return this.address
    }
  }
})

