import { ethers, upgrades } from "hardhat";

async function main() {
  const clearinghouse = "0xdb7eCDBac52c3a96e19a27B7f62eE03fFA288F4F";
  const endpoint = "0x8065620db514138Cdda689fd559f38B7a57381ff";
  const productEngineSpot = "0x164d649Ae45b8bC1Ba84b3FEb196ef079b578589";
  const productEnginePerp = "0x07145FF14a12b8E364D14e4122a365b6C72bd883";
  const admin = "0x31D89Af26B0FFC1cC08a5748D6d5927cb7e17fEf";
  const feeCalculator = "0xAd7d3e09933814c21563520785D949A8df8F70Eb";

  // OffchainBook BTC
  const OffchainBook = await ethers.getContractFactory("OffchainBook");
  const offchainBook = await upgrades.deployProxy(
    OffchainBook,
    [
      clearinghouse,
      productEngineSpot,
      endpoint,
      admin,
      feeCalculator,
      // token
      1,
      ethers.BigNumber.from("1000000000000000"), // 0,001
      ethers.BigNumber.from("1000000000000000000"), // 1
      ethers.BigNumber.from("10000000000000000"), // 0,01
      ethers.BigNumber.from("3000000000000000"), // 0,003
    ],
    {
      initializer: "initialize",
    }
  );
  await offchainBook.deployed();

  console.log("offchainbook address: ", offchainBook.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// address: 0xC8C4eAb1228a17AbB0246F6818e3B508F55C0198

// const offchainBook = await upgrades.deployProxy(
//     OffchainBook,
//     [
//       clearinghouse,
//       productEngineSpot,
//       endpoint,
//       admin,
//       feeCalculator,
//       // token
//       1,
//       ethers.BigNumber.from("1000000000000000"), // 0,001
//       ethers.BigNumber.from("1000000000000000000"), // 1
//       ethers.BigNumber.from("10000000000000000"), // 0,01
//       ethers.BigNumber.from("3000000000000000"), // 0,003
//     ],
//     {
//       initializer: "initialize",
//     }
//   );
