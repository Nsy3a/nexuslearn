require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const [deployer, contributor] = await hre.ethers.getSigners();
  const escrow = await hre.ethers.getContractAt("Escrow", process.env.ESCROW_ADDRESS);
  const usdc = await hre.ethers.getContractAt("USDCMock", process.env.USDC_ADDRESS);

  // 1. 创建并资助 Escrow
  const demandId = "real_001";
  const amount = hre.ethers.parseUnits("100", 6);
  console.log("Creating escrow...");
  await escrow.createEscrow(demandId, process.env.USDC_ADDRESS, amount);
  await usdc.approve(process.env.ESCROW_ADDRESS, amount);
  await escrow.fund(demandId);
  console.log("✅ Escrow funded");

  // 2. 提交工作
  await escrow.submitWork(demandId);
  console.log("✅ Work submitted");

  // 3. 验收并分发 USDC
  const contributors = [contributor.address];
  const shares = [10000];
  await escrow.accept(demandId, contributors, shares);
  console.log("✅ Accepted and distributed");

  // 4. 查询余额（可选）
  try {
    const bal = await usdc.balanceOf(contributor.address);
    console.log("Contributor USDC balance:", hre.ethers.formatUnits(bal, 6));
  } catch (e) {
    console.log("Skip balance query");
  }
}

main().catch(console.error);