const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const eventsFile = path.join(__dirname, 'data', 'chain_events.json');
const escrowsFile = path.join(__dirname, 'data', 'escrows.json');
const nftsFile = path.join(__dirname, 'data', 'nfts.json');

function readJson(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch { return []; }
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

function syncEvents() {
  const events = readJson(eventsFile);
  const escrows = readJson(escrowsFile);
  const nfts = readJson(nftsFile);

  events.forEach(e => {
    if (e.event === 'EscrowCreated') {
      const exists = escrows.find(ex => ex.demandId === e.demandId);
      if (!exists) {
        escrows.push({
          escrowId: 'esc_' + e.demandId,
          demandId: e.demandId,
          token: e.token,
          amount: e.amount,
          status: 'CREATED',
          createdAt: e.ts
        });
      }
    }
    if (e.event === 'EscrowDistributed') {
      const ex = escrows.find(ex => ex.demandId === e.demandId);
      if (ex) ex.status = 'DISTRIBUTED';
    }
    if (e.event === 'KnowledgeMinted') {
      const exists = nfts.find(n => n.nftId === e.tokenId);
      if (!exists) {
        nfts.push({
          nftId: e.tokenId,
          demandId: e.demandId,
          contentHash: e.contentHash,
          mintedAt: e.ts
        });
      }
    }
  });

  writeJson(escrowsFile, escrows);
  writeJson(nftsFile, nfts);
  console.log('Chain sync done');
}

if (require.main === module) {
  syncEvents();
}

module.exports = { syncEvents };