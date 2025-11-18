import { ethers } from 'ethers'

declare global { interface Window { ethereum?: any } }

export function getProvider() {
  if (!window.ethereum) throw new Error('No wallet')
  return new ethers.BrowserProvider(window.ethereum)
}

export async function getSigner() {
  const provider = getProvider()
  await provider.send('eth_requestAccounts', [])
  return await provider.getSigner()
}

export function getGovernorContract(address: string, signer: ethers.Signer) {
  const abi = [
    'function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) returns (uint256)',
    'function castVote(uint256 proposalId, uint8 support) returns (uint256)'
  ]
  return new ethers.Contract(address, abi, signer)
}

export function getEscrowContract(address: string, signer: ethers.Signer) {
  const abi = [
    'function accept(string _demandId, address[] _contributors, uint256[] _shares)'
  ]
  return new ethers.Contract(address, abi, signer)
}

export function getNFTContract(address: string, signer: ethers.Signer) {
  const abi = [
    'function mintKnowledge(address to, string _contentHash, string _summary, address[] _contributors, uint256[] _shares, string _demandId, string _tokenURI) returns (uint256)'
  ]
  return new ethers.Contract(address, abi, signer)
}

export function getERC20Contract(address: string, signer: ethers.Signer) {
  const abi = [
    'function transfer(address to, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)'
  ]
  return new ethers.Contract(address, abi, signer)
}

export async function switchChain(chainIdHex: string) {
  if (!window.ethereum) throw new Error('No wallet')
  try {
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: chainIdHex }] })
  } catch (e: any) {
    // ignore if not added
  }
}
