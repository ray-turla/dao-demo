import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";

const deployDaoToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying Dao Token...");
  log(`Signer: ${deployer}`)
  const daoToken = await deploy("DaoToken", {
    from: deployer,
    args: [],
    log: true,
  });
  await delegate(daoToken.address, deployer);
};

const delegate = async (daoTokenAddress: string, delegatedAccount: string) => {
  const daoToken = await ethers.getContractAt("DaoToken", daoTokenAddress); 
  const tx = await daoToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(`Checkpoints ${await daoToken.numCheckpoints(delegatedAccount)}`);
}

export default deployDaoToken;