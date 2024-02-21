import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(">> deployer: ", deployer.address);

  // const Sequencer = await ethers.getContractFactory("Sequencer");
  // const sequencer = await upgrades.deployProxy(Sequencer);
  // await sequencer.deployed();

  // console.log(">> Sequencer: ", sequencer.address);

  const wwETH = await ethers.getContractFactory("wwETH");
  const wwETHContract = await wwETH.deploy();
  await wwETHContract.deployed();

  console.log(">> Sequencer: ", wwETHContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
