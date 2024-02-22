import { network, ethers } from "hardhat";
import { CONTRACT_ADDRESS, DAO_CONFIG, DEV_CONFIG } from "../config";
import { moveBlocks } from "../utils";
import { EventLog } from "ethers";
import fs from 'fs';
export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
  const { VOTING_DELAY } = DAO_CONFIG
  const daoGovernor = await ethers.getContractAt("DaoGovernor", CONTRACT_ADDRESS.DAO_GOVERNOR);
  const travelLocation = await ethers.getContractAt("TravelLoc", CONTRACT_ADDRESS.TRAVEL_LOC);
  const encodedFunctionCall = travelLocation.interface.encodeFunctionData(
    functionToCall,
    args
  );
  const currentTravelLocation = await travelLocation.retrieve();

  console.log("Current Travel Location: ", currentTravelLocation)
  console.log(`Proposing ${functionToCall} on ${CONTRACT_ADDRESS.TRAVEL_LOC} with ${args}`);
  console.log(`Proposal Description: ${proposalDescription}`)
  const proposalTx = await daoGovernor.propose(
    [await travelLocation.getAddress()],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );

  if (DEV_CONFIG.CHAINS.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }
  const proposalReceipt = await proposalTx.wait(1);
  const proposalEvent = proposalReceipt?.logs.filter(l => l instanceof EventLog)[0] as EventLog
  const [proposalId] = proposalEvent?.args;

  console.log(`Proposed with proposal id: ${proposalId}`);

  const proposalState = await daoGovernor.state(proposalId);
  const proposalSnapShot = await daoGovernor.proposalSnapshot(proposalId)
  const proposalDeadline = await daoGovernor.proposalDeadline(proposalId)

  console.log("Proposal state: ", proposalState);
  console.log("Proposal snapshot: ", proposalSnapShot);
  console.log("Proposal deadline: ", proposalDeadline);
  // save the proposalId
  storeProposalId(proposalId);
}

function storeProposalId(proposalId: any) {
  const { PROPOSALS_FILE } = DAO_CONFIG
  console.log(`Saving Proposals at ${PROPOSALS_FILE}`);
  const networkName = network.name;
  let proposals:any;

  if (fs.existsSync(PROPOSALS_FILE)) {
      console.log(`${PROPOSALS_FILE} exists. Adding new proposal to file...`);
      proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, "utf8"));
  } else {
    console.log(`${PROPOSALS_FILE} doesn't exist. Making new File...`);
      proposals = { };
      proposals[networkName] = [];
  }   
  proposals[networkName].push(proposalId.toString());
  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals), "utf8");
  console.log(`${PROPOSALS_FILE} saved.`);
}

propose(
  DEV_CONFIG.PROPOSAL_ARGS,
  DEV_CONFIG.PROPOSAL_FUNC,
  DEV_CONFIG.PROPOSAL_DESCRIPTION
)
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  });