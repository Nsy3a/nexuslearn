const hre = require("hardhat")

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  const supply = hre.ethers.parseUnits("10000000", 18)
  const NEXLToken = await hre.ethers.getContractFactory("NEXLToken")
  const token = await NEXLToken.deploy(deployer.address, supply)
  await token.waitForDeployment()
  const tokenAddress = await token.getAddress()

  const minDelay = 3600
  const proposers = []
  const executors = []
  const TimelockController = await hre.ethers.getContractFactory("TimelockController")
  const timelock = await TimelockController.deploy(minDelay, proposers, executors, deployer.address)
  await timelock.waitForDeployment()
  const timelockAddress = await timelock.getAddress()

  const NEXLGovernor = await hre.ethers.getContractFactory("NEXLGovernor")
  const governor = await NEXLGovernor.deploy(token, timelock)
  await governor.waitForDeployment()
  const governorAddress = await governor.getAddress()

  console.log("NEXLToken:", tokenAddress)
  console.log("Timelock:", timelockAddress)
  console.log("Governor:", governorAddress)

  const fs = require('fs')
  const path = require('path')
  const out = path.join(__dirname, `../addresses.${hre.network.name}.json`)
  let data = {}
  try { data = JSON.parse(fs.readFileSync(out, 'utf8')) } catch {}
  data.NEXL_ADDRESS = tokenAddress
  data.TIMELOCK_ADDRESS = timelockAddress
  data.GOVERNOR_ADDRESS = governorAddress
  fs.writeFileSync(out, JSON.stringify(data, null, 2))
  console.log("Addresses written to", out)
}

main().catch(console.error)
