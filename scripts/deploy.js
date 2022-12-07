const hre = require("hardhat");

async function main() {
  const ENS = await hre.ethers.getContractFactory('ENS');
  const ens = await ENS.deploy();
  await ens.deployed();

  console.log("Contract deployed to:", ens.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
