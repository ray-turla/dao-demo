import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { DAO_CONFIG } from "../config";

const deployDaoToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const {
    TIMELOCK_MIN_DELAY
  } = DAO_CONFIG
  log("Deploying TimeLock ...");
  const timelock = await deploy("TimeLock", {
    from: deployer,
    args: [
      TIMELOCK_MIN_DELAY,
      [],
      [],
      deployer
    ],
    log:true  
  });
};

export default deployDaoToken;