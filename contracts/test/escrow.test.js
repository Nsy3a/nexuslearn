const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", function () {
  let Escrow, escrow, owner, addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();
    await escrow.waitForDeployment();
  });

  it("Should create escrow", async () => {
    await escrow.createEscrow("d1", addr1.address, 1000);
    const e = await escrow.getEscrow("d1");
    expect(e.payer).to.equal(owner.address);
    expect(e.amount).to.equal(1000);
    expect(e.state).to.equal(0); // CREATED
  });

  it("Should fund escrow", async () => {
    await escrow.createEscrow("d1", addr1.address, 1000);
    await escrow.fund("d1");
    const e = await escrow.getEscrow("d1");
    expect(e.state).to.equal(1); // FUNDED
  });

  it("Should accept and distribute", async () => {
    await escrow.createEscrow("d1", addr1.address, 10000);
    await escrow.fund("d1");
    await escrow.submitWork("d1");
    await escrow.accept("d1", [addr1.address], [10000]);
    const e = await escrow.getEscrow("d1");
    expect(e.state).to.equal(5); // DISTRIBUTED
  });
});