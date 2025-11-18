const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer, contributor] = await hre.ethers.getSigners();
  const escrow = await hre.ethers.getContractAt("Escrow", process.env.ESCROW_ADDRESS);
  const usdc = await hre.ethers.getContractAt("USDCMock", process.env.USDC_ADDRESS);
  const nft = await hre.ethers.getContractAt("KnowledgeNFT", process.env.NFT_ADDRESS);

  console.log("=== 演示：完整链上流程 ===");

  // 1. 发行 USDC 给 payer
  const amount = hre.ethers.parseUnits("100", 6);
  await usdc.transfer(deployer.address, amount);
  console.log("✅ USDC 已转给 payer");

  // 2. 创建 Escrow
  const demandId = "demo_001";
  await escrow.createEscrow(demandId, process.env.USDC_ADDRESS, amount);
  console.log("✅ Escrow 已创建");

  // 3. 存入资金（approve + fund）
  await usdc.approve(process.env.ESCROW_ADDRESS, amount);
  await escrow.fund(demandId);
  console.log("✅ 资金已存入");

  // 4. 提交工作
  await escrow.submitWork(demandId);
  console.log("✅ 工作已提交");

  // 5. 验收并分发
  const contributors = [contributor.address];
  const shares = [10000]; // 100%
  await escrow.accept(demandId, contributors, shares);
  console.log("✅ 已验收并分发赏金");

  // 6. 铸造 NFT
  const tokenURI = "https://api.nexuslearn.io/nft/demo_001";
  await nft.mintKnowledge(
    deployer.address,
    "ipfs://QmDemo",
    "Demo 解决方案",
    contributors,
    shares,
    demandId,
    tokenURI
  );
  console.log("✅ NFT 已铸造");

  // 7. 查询结果
  const e = await escrow.getEscrow(demandId);
  console.log("Escrow 状态:", e.state);
  const totalSupply = await nft.totalSupply();
  console.log("NFT 总供应量:", totalSupply.toString());
}

main().catch(console.error);