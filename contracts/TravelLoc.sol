// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TravelLoc is Ownable {
  string private location;

  constructor(address initialOwner) 
  Ownable(initialOwner)
  {}

  event LocationChanged(string location);

  function store(string memory newLocation) public onlyOwner {
    location = newLocation;
    emit LocationChanged(newLocation);
  }

  // Reads the last stored value
  function retrieve() public view returns (string memory) {
    return location;
  }
}