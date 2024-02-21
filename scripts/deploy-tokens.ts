import { ethers } from "hardhat";

async function main() {
  const USDC = await ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy();
  await usdc.deployed();
  console.log(">> USDC: ", usdc.address);
  console.log("done usdc");

  const BTC = await ethers.getContractFactory("BTC");
  const btc = await BTC.deploy();
  await btc.deployed();
  console.log(">> BTC: ", btc.address);
  console.log("done btc");

  const ETH = await ethers.getContractFactory("ETH");
  const eth = await ETH.deploy();
  await eth.deployed();
  console.log(">> ETH: ", eth.address);
  console.log("done eth");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// address
// BTC: 0xE9e3F78971C0d1d527112c702eEDfa4c48B9b398
// ETH: 0xcAA92637f8ED8e1B5Cb6FeE725e637610c4D083C
// USDC: 0xc38a8b5DEB964E1537799c07D7F2eA79CD0f0279
