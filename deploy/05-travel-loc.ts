import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";

const deployTravelLoc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying Travel Loc...");
  const travelLoc = await deploy("TravelLoc", {
    from: deployer,
    args: [deployer],
    log: true,
  });
  const deployedTimelock = await get("TimeLock");
  const timelock = await ethers.getContractAt("TimeLock", deployedTimelock.address);
  const travelLocContract = await ethers.getContractAt("TravelLoc", travelLoc.address);
  const transferOwnerTx = await travelLocContract.transferOwnership(await timelock.getAddress())

  console.log(`Travel Loc transfered to Timelock. TX: ${transferOwnerTx.blockHash}`);
};

export default deployTravelLoc;