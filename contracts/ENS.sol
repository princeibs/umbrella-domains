// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import {StringUtils} from "./libraries/StringUtils.sol";
import "hardhat/console.sol";

contract ENS is ERC721URIStorage {

    constructor (string memory _tld) payable ERC721("Umbrella Tokens", "UMT") {
       
    }
    
}