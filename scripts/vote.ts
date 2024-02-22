import { network, ethers } from "hardhat";
import { CONTRACT_ADDRESS, DAO_CONFIG, DEV_CONFIG } from "../config";
import { moveBlocks } from "../utils";
import fs from 'fs';

export async function vote(proposalIndex: number) {
  const { VOTING_PERIOD, PROPOSALS_FILE } = DAO_CONFIG;
  const proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, "utf-8"));
  const proposalId = proposals[network.name][proposalIndex];

  const daoGovernor = await ethers.getContractAt("DaoGovernor", CONTRACT_ADDRESS.DAO_GOVERNOR)
  const votingWay = 1;
  const reason = "White Sand Beaches with Bitches";

  const voteTx = await daoGovernor.castVoteWithReason(
    proposalId,
    votingWay,
    reason
  )
  // 0 = Against, 1 = For, 2 = Abstain

  if (DEV_CONFIG.CHAINS.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }

  await voteTx.wait(1);

  const state = await daoGovernor.state(proposalId);

  console.log("Voted! Ready to go");

  console.log("Proposal State: ", state);
}

vote(0)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });