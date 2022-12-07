const hre = require("hardhat");

async function main() {
  const ENS = await hre.ethers.getContractFactory('ENS');
  const ens = await ENS.deploy();
  await ens.deployed();

  console.log("Contract deployed to:", ens.address);
  storeContractData(ens);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/ENS-address.json",
    JSON.stringify({ ENS: contract.address }, undefined, 2)
  );

  const ENSArtifacts = hre.artifacts.readArtifactSync("ENS"); 

  fs.writeFileSync(
    contractsDir + "/ENS.json",
    JSON.stringify(ENSArtifacts, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
