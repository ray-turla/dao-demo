import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { DAO_CONFIG } from "../config";

const deployDaoGovernor: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const { VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE } = DAO_CONFIG;
  const daoToken = await get("DaoToken");
  const timelock = await get("TimeLock");
  log("Deploying DaoGovernor...");
  const daoGovernor = await deploy("DaoGovernor", {
    from: deployer,
    args: [
      daoToken.address,
      timelock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE
    ],
    log:true,
  });
};

export default deployDaoGovernor;