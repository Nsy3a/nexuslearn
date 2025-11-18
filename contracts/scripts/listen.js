require('dotenv').config();
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const eventsFile = path.join(__dirname, "..", "..", "backend", "data", "chain_events.json");

async function main() {
  const provider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const escrow = new hre.ethers.Contract(process.env.ESCROW_ADDRESS, [
    "event EscrowCreated(string indexed demandId, address indexed payer, address token, uint256 amount)",
    "event EscrowDistributed(string indexed demandId, address[] contributors, uint256[] shares)"
  ], provider);
  const nft = new hre.ethers.Contract(process.env.NFT_ADDRESS, [
    "event KnowledgeMinted(uint256 indexed tokenId, string indexed demandId, string contentHash)"
  ], provider);

  escrow.on("EscrowCreated", (demandId, payer, token, amount) => {
    const e = { event: "EscrowCreated", demandId, payer, token, amount: amount.toString(), ts: Date.now() };
    console.log(e);
    appendEvent(e);
  });

  escrow.on("EscrowDistributed", (demandId, contributors, shares) => {
    const e = { event: "EscrowDistributed", demandId, contributors, shares, ts: Date.now() };
    console.log(e);
    appendEvent(e);
  });

  nft.on("KnowledgeMinted", (tokenId, demandId, contentHash) => {
    const e = { event: "KnowledgeMinted", tokenId: tokenId.toString(), demandId, contentHash, ts: Date.now() };
    console.log(e);
    appendEvent(e);
  });

  const governor = await hre.ethers.getContractAt("NEXLGovernor", process.env.GOVERNOR_ADDRESS);
  governor.on("ProposalCreated", (id, proposer, targets, values, signatures, calldatas, startBlock, endBlock, description) => {
    const e = { event: "ProposalCreated", id: id.toString(), proposer, startBlock: startBlock.toString(), endBlock: endBlock.toString(), description, ts: Date.now() };
    console.log(e);
    appendEvent(e);
  });
  governor.on("VoteCast", (voter, proposalId, support, weight, reason) => {
    const e = { event: "VoteCast", voter, proposalId: proposalId.toString(), support, weight: weight.toString(), reason, ts: Date.now() };
    console.log(e);
    appendEvent(e);
  });

  console.log("Listening...");
}

function appendEvent(evt) {
  let arr = [];
  try {
    const raw = fs.readFileSync(eventsFile, "utf8");
    arr = JSON.parse(raw || "[]");
  } catch {}
  arr.push(evt);
  fs.writeFileSync(eventsFile, JSON.stringify(arr, null, 2));
}

main().catch(console.error);
