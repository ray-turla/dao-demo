import { network, ethers } from "hardhat";
import { CONTRACT_ADDRESS, DAO_CONFIG, DEV_CONFIG } from "../config";
import { moveBlocks, moveTime } from "../utils";

export async function queueAndExecute() {
  const { VOTING_PERIOD, PROPOSALS_FILE, TIMELOCK_MIN_DELAY } = DAO_CONFIG;
  const travelLocation = await ethers.getContractAt("TravelLoc", CONTRACT_ADDRESS.TRAVEL_LOC);
  const encodedFunctionCall = travelLocation.interface.encodeFunctionData(
    DEV_CONFIG.PROPOSAL_FUNC,
    DEV_CONFIG.PROPOSAL_ARGS
  )
  const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes(DEV_CONFIG.PROPOSAL_DESCRIPTION))

  const daoGovernor = await ethers.getContractAt("DaoGovernor", CONTRACT_ADDRESS.DAO_GOVERNOR)


  const queueTx = await daoGovernor.queue(
    [CONTRACT_ADDRESS.TRAVEL_LOC],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );

  console.log("Queueing proposal...");
  // 0 = Against, 1 = For, 2 = Abstain

  if (DEV_CONFIG.CHAINS.includes(network.name)) {
    await moveTime(TIMELOCK_MIN_DELAY + 1);
    await moveBlocks(1);
  }

  await queueTx.wait(1);

  console.log("Executing proposal...");

  const executeTx = await daoGovernor.execute(
    [CONTRACT_ADDRESS.TRAVEL_LOC],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );

  await executeTx.wait(1);
  
  const newTravelLocation = await travelLocation.retrieve();

  console.log("New Travel Location: ", newTravelLocation)
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });