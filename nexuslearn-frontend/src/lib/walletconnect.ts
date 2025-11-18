import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ethers } from 'ethers'

export async function connectWithWalletConnect(projectId: string, chains: number[] = [11155111]) {
  const provider = await EthereumProvider.init({ 
    projectId, 
    chains, 
    optionalChains: chains as [number, ...number[]],
    showQrModal: true 
  })
  await provider.enable()
  const eip1193 = provider as any
  const ethersProvider = new ethers.BrowserProvider(eip1193)
  const signer = await ethersProvider.getSigner()
  const address = await signer.getAddress()
  return { signer, address }
}

