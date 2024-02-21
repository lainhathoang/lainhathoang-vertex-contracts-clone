import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  //   const [signer] = await ethers.getSigners();
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/rPK4QygZ7Is2sxlPlCMSWN9yoSFiI2If"
  );

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

  const tx = await signer.sendTransaction({
    to: "0x92d3267215Ec56542b985473E73C8417403B15ac",
    value: ethers.utils.parseUnits("1", "ether"),
    nonce: 114,
  });
  tx.wait();
  console.log(tx);
})();
