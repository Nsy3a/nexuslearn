const { ethers } = require('ethers')
const fs = require('fs')
const path = require('path')

const ESCROW_ABI = [
  "function createEscrow(string _demandId, address _token, uint256 _amount) external",
  "function fund(string _demandId) external",
  "function accept(string _demandId, address[] _contributors, uint256[] _shares) external",
  "function getEscrow(string _demandId) external view returns (address payer, address token, uint256 amount, uint8 state, string demandId, address[] contributors, uint256[] shares)"
]

const NFT_ABI = [
  "function mintKnowledge(address to, string _contentHash, string _summary, address[] _contributors, uint256[] _shares, string _demandId, string _tokenURI) external returns (uint256)"
]

const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)"
]

const GOVERNOR_ABI = [
  "function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) public returns (uint256)",
  "function castVote(uint256 proposalId, uint8 support) public returns (uint256)",
  "function state(uint256 proposalId) public view returns (uint8)",
  "event ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)",
  "event VoteCast(address voter, uint256 proposalId, uint8 support, uint256 weight, string reason)"
]

const NEXL_ABI = [
  "function mint(address to, uint256 amount) external"
]

class ContractClient {
  constructor(rpcUrl, privateKey) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.wallet = new ethers.Wallet(privateKey, this.provider)
  }

  connectEscrow(address) {
    this.escrow = new ethers.Contract(address, ESCROW_ABI, this.wallet)
  }

  connectNFT(address) {
    this.nft = new ethers.Contract(address, NFT_ABI, this.wallet)
  }

  connectUSDC(address) {
    this.usdc = new ethers.Contract(address, USDC_ABI, this.wallet)
  }

  connectGovernor(address) {
    this.governor = new ethers.Contract(address, GOVERNOR_ABI, this.wallet)
  }

  connectNEXL(address) {
    this.nexl = new ethers.Contract(address, NEXL_ABI, this.wallet)
  }

  async createEscrow(demandId, token, amount) {
    const tx = await this.escrow.createEscrow(demandId, token, amount)
    return await tx.wait()
  }

  async fundEscrow(demandId) {
    const tx = await this.escrow.fund(demandId)
    return await tx.wait()
  }

  async approveUSDC(spender, amount) {
    const tx = await this.usdc.approve(spender, amount)
    return await tx.wait()
  }

  async acceptAndDistribute(demandId, contributors, shares) {
    const tx = await this.escrow.accept(demandId, contributors, shares)
    return await tx.wait()
  }

  async mintNFT(to, contentHash, summary, contributors, shares, demandId, tokenURI) {
    const tx = await this.nft.mintKnowledge(to, contentHash, summary, contributors, shares, demandId, tokenURI)
    return await tx.wait()
  }

  async mintNEXL(to, amountWei) {
    const tx = await this.nexl.mint(to, amountWei)
    return await tx.wait()
  }

  async propose(targets, values, calldatas, description) {
    const tx = await this.governor.propose(targets, values, calldatas, description)
    return await tx.wait()
  }

  async castVote(proposalId, support) {
    const tx = await this.governor.castVote(proposalId, support)
    return await tx.wait()
  }
}

module.exports = { ContractClient }
