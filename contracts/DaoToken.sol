// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract DaoToken is ERC20, Ownable, ERC20Permit, ERC20Votes {
  uint256 max_supply = 1e14;
  constructor()
      ERC20("DaoToken", "DTK")
      Ownable(msg.sender)
      ERC20Permit("DaoToken")
  {
    _mint(msg.sender, max_supply);
  }

  // The following functions are overrides required by Solidity.

  function _update(address from, address to, uint256 value)
      internal
      override(ERC20, ERC20Votes)
  {
      super._update(from, to, value);
  }

  function nonces(address owner)
      public
      view
      override(ERC20Permit, Nonces)
      returns (uint256)
  {
      return super.nonces(owner);
  }
}
