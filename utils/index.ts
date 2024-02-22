import { network } from "hardhat";

export async function moveBlocks(amount: number) {
  console.log("Moving blocks...");
  for (let i = 0; i < amount; i++) {
    await network.provider.send("evm_mine", []);
  }
  console.log(`Moved ${amount} blocks`);
}

export async function moveTime(time: number) {
  console.log("Moving time...");
  await network.provider.send("evm_increaseTime", [time]);
  console.log(`Moved forward for ${time}s`);
}