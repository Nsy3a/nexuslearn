const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("Escrow deployed to:", escrowAddress);

  const USDCMock = await hre.ethers.getContractFactory("USDCMock");
  const usdc = await USDCMock.deploy(hre.ethers.parseUnits("1000000", 6));
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("USDCMock deployed to:", usdcAddress);

  const KnowledgeNFT = await hre.ethers.getContractFactory("KnowledgeNFT");
  const nft = await KnowledgeNFT.deploy(deployer.address);
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("KnowledgeNFT deployed to:", nftAddress);

  // 输出环境变量
  const fs = require('fs')
  const path = require('path')
  const out = path.join(__dirname, `../addresses.${hre.network.name}.json`)
  let data = {}
  try { data = JSON.parse(fs.readFileSync(out, 'utf8')) } catch {}
  data.ESCROW_ADDRESS = escrowAddress
  data.NFT_ADDRESS = nftAddress
  data.USDC_ADDRESS = usdcAddress
  fs.writeFileSync(out, JSON.stringify(data, null, 2))
  console.log("Addresses written to", out)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
