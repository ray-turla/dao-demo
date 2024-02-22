import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { DAO_CONFIG } from "../config";

const setupGovernance: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const { VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE } = DAO_CONFIG;
  const deployedTimelock = await get("TimeLock");
  const deployedDaoGovernor = await get("DaoGovernor");
  const timelock = await ethers.getContractAt("TimeLock", deployedTimelock.address);
  const daoGovernor = await ethers.getContractAt("DaoGovernor", deployedDaoGovernor.address);
  log("Setting up roles...");
  const proposer = await timelock.PROPOSER_ROLE();
  console.log(`${proposer}`)
  const executor = await timelock.EXECUTOR_ROLE();
  const admin = await timelock.DEFAULT_ADMIN_ROLE();
  const proposerTx = await timelock.grantRole(proposer, await daoGovernor.getAddress());
  await proposerTx.wait(1);
  const executorTx = await timelock.grantRole(executor, ethers.ZeroAddress);
  await executorTx.wait(1);
  const revokeTx = await timelock.revokeRole(admin, deployer);
  await revokeTx.wait(1);

  console.log(`Role setup Complete!`);
};

export default setupGovernance;