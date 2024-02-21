import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(">> deployer: ", deployer.address);

  // "quote" => USDC
  // "sequencer" => back-end account use to excute
  // "sanactions", get price with oracle?

  const usdc = "0xc38a8b5DEB964E1537799c07D7F2eA79CD0f0279"; // quote
  const sequencer = "0x31D89Af26B0FFC1cC08a5748D6d5927cb7e17fEf";

  // FEE CALCULATOR
  const FeeCalculator = await ethers.getContractFactory("FeeCalculator");
  const feeCalculator = await FeeCalculator.deploy();
  await feeCalculator.deployed();
  console.log("done feeCal");
  // ========================

  //  SPOT ENGINE
  const SpotEngine = await ethers.getContractFactory("SpotEngine");
  const spotEngine = await SpotEngine.deploy();
  await spotEngine.deployed();
  console.log("done spotengine");

  // PERP ENGINE
  const PerpEngine = await ethers.getContractFactory("PerpEngine");
  const perpEngine = await PerpEngine.deploy();
  await perpEngine.deployed();
  console.log("done perp");

  // CLEARING HOUSE LIQ
  const ClearinghouseLiq = await ethers.getContractFactory("ClearinghouseLiq");
  const clearinghouseLiq = await ClearinghouseLiq.deploy();
  await clearinghouseLiq.deployed();
  console.log("done clearinghouselid");
  // ========================

  // CLEARING HOUSE
  const Clearinghouse = await ethers.getContractFactory("Clearinghouse");
  const clearinghouse = await upgrades.deployProxy(
    Clearinghouse,
    [
      "0x0000000000000000000000000000000000000000", // endpoint -> 'll set later
      usdc, // quote -> USDC
      feeCalculator.address,
      clearinghouseLiq.address,
    ],
    {
      initializer: "initialize",
      unsafeAllow: ["delegatecall"],
    }
  );
  await clearinghouse.deployed();
  console.log("done clearinghouse");
  // ========================

  // ENDPOINT
  const Endpoint = await ethers.getContractFactory("Endpoint");
  const endpoint = await upgrades.deployProxy(
    Endpoint,
    [
      "0x0000000000000000000000000000000000000000", // sanactions address,
      sequencer, // sequencer address,
      clearinghouse.address, // clearinghouse address
      72000, // slowModeTimeout - if place order with CLOB failed -> AMM
      0, // time {perpTime, spotTime}??
      [
        ethers.BigNumber.from("52000000000000000000000"),
        ethers.BigNumber.from("52000000000000000000000"),
        ethers.BigNumber.from("2700000000000000000000"),
        ethers.BigNumber.from("2700000000000000000000"),
      ], // price[a-spot, a-perp, b-spot, b-perp, ...] -> healthGroup
    ],
    {
      initializer: "initialize",
      unsafeAllow: ["delegatecall"],
    }
  );
  await endpoint.deployed();
  console.log("done endpoint");

  // set endpoint, add engines for clearing house
  await clearinghouse.setEndpoint(endpoint.address);
  // await clearinghouse.connect(deployer).addEngine(spotEngine.address, 0);
  // await clearinghouse.connect(deployer).addEngine(perpEngine.address, 1);

  console.log("Addresses");
  console.log(">> FeeCalculator: ", feeCalculator.address);
  console.log(">> ClearinghouseLiq: ", clearinghouseLiq.address);
  console.log(">> Clearinghouse: ", clearinghouse.address);
  console.log(">> Endpoint: ", endpoint.address);
  console.log(">> SpotEngine: ", spotEngine.address);
  console.log(">> PerpEngine: ", perpEngine.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Addresses
// >> FeeCalculator:  0xAd7d3e09933814c21563520785D949A8df8F70Eb
// >> ClearinghouseLiq:  0xBe334E22392a67374B996D5250a37e5Ae081De10

// >> Clearinghouse:  0xdb7eCDBac52c3a96e19a27B7f62eE03fFA288F4F
// >> Endpoint:  0x8065620db514138Cdda689fd559f38B7a57381ff

// >> SpotEngine:  0x164d649Ae45b8bC1Ba84b3FEb196ef079b578589
// >> PerpEngine:  0x07145FF14a12b8E364D14e4122a365b6C72bd883

0xede149cd834ac2ca60e7f256e450763152d2e89e64656661756c740000000000;
0x31d89af26b0ffc1cc08a5748d6d5927cb7e17fef64656661756c740000000000;

0xde55e70d3bfb65f20908358179715fdaf8c7da6d64656661756c740000000000;

// "default" sub-account (12-bytes): 64656661756c740000000000

0x31D89Af26B0FFC1cC08a5748D6d5927cb7e17fEf // 20 bytes + 64656661756c740000000000 // 12 bytes => 32 bytes 