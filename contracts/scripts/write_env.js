const fs = require('fs')
const path = require('path')

function writeEnv(frontendEnvPath, backendEnvPath, addrs) {
  const feLines = [
    `VITE_GOVERNOR_ADDRESS=${addrs.GOVERNOR_ADDRESS || ''}`,
    `VITE_ESCROW_ADDRESS=${addrs.ESCROW_ADDRESS || ''}`,
    `VITE_NFT_ADDRESS=${addrs.NFT_ADDRESS || ''}`,
    `VITE_WALLETCONNECT_PROJECT_ID=`
  ]
  fs.writeFileSync(frontendEnvPath, feLines.join('\n'))

  const beLines = [
    `ESCROW_ADDRESS=${addrs.ESCROW_ADDRESS || ''}`,
    `NFT_ADDRESS=${addrs.NFT_ADDRESS || ''}`,
    `USDC_ADDRESS=${addrs.USDC_ADDRESS || ''}`,
    `GOVERNOR_ADDRESS=${addrs.GOVERNOR_ADDRESS || ''}`,
    `NEXL_ADDRESS=${addrs.NEXL_ADDRESS || ''}`
  ]
  fs.writeFileSync(backendEnvPath, beLines.join('\n'))
}

function main() {
  const network = process.argv[2] || 'sepolia'
  const addressesPath = path.join(__dirname, `../addresses.${network}.json`)
  const addrs = JSON.parse(fs.readFileSync(addressesPath, 'utf8'))
  const feEnv = path.join(__dirname, '../../nexuslearn-frontend/.env')
  const beEnv = path.join(__dirname, '../../nexuslearn/backend/.env')
  writeEnv(feEnv, beEnv, addrs)
  console.log('Updated env files:', feEnv, beEnv)
}

main()

