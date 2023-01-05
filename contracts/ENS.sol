// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import {StringUtils} from "./libraries/StringUtils.sol";

string constant svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#a)" d="M0 0h270v270H0z"/><defs><filter id="b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="300" width="300"><feDropShadow dx="8" dy="-10" stdDeviation="2" flood-opacity=".8" width="200%" height="200%"/></filter></defs><defs><linearGradient id="a" x1="270" y1="270" x2="0" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#00ff7f"/><stop offset="1" stop-opacity="0"/></linearGradient></defs><text x="32.5" y="231" font-size="17" fill="#fff" filter="url(#b)" font-family="monospace,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold" text-overflow="ellipsis">';
string constant svgPartTwo = '</text></svg>';

contract ENS is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Name {        
        string ethAddress;
        string btcAddress;
        string ltcAddress;
        string bnbAddress;
        string solanaAddress;        
    }

    address payable public immutable owner;

    // tld = Top Level Domain (e.g .crypto, .eth)
    // tld => name => address
    mapping(string => mapping(string => address)) public register;
    mapping(string => uint) public tldCount;
    mapping(string => Name) public data;
    mapping(string => uint) public nameToIds;
    string[] public names;

    event RegisterName(string name, address indexed owner);
    event UpdateData(string name);

    error NameAlreadyExists();
    error Unauthorized();
    /// `sent` - amount sent by user
    /// `expected` - expected amount to send
    error InvalidFunds(uint expected, uint sent);
    error InvalidName(string name);

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor () payable ERC721("Umbrella Tokens", "UMT") {
       owner = payable(msg.sender);
    }

    function cost(string calldata name) private pure returns (uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 2) {
            return 10 * 10**16; // .1 ether
        } else if (len == 3) {
            return 5 * 10**16; // .05 ether
        } else if (len == 4) {
            return 3 * 10**16; // .03 ether
        } else {
            return 1 * 10**16; // .01 ether
        }
    }  

    function validName(string calldata name) private pure returns (bool) {
        return StringUtils.strlen(name) >= 2 && StringUtils.strlen(name) <= 32;
    }

    function setName(string calldata _name, string calldata _tld, string calldata ethAddress) external payable {
        uint nameCost = cost(_name);   
        if (!validName(_name)) revert InvalidName(_name);
        if (msg.value < nameCost) revert InvalidFunds(nameCost, msg.value);
        if (register[_tld][_name] != address(0)) revert NameAlreadyExists(); 
        
        string memory text = string(abi.encodePacked(_name,".",_tld));
        string memory finalSvg = string(abi.encodePacked(svgPartOne, text, svgPartTwo));                    
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();

        string memory json = Base64.encode(
            abi.encodePacked(
                '{',
                    '"name": "', string.concat(_name, ".", _tld), '",',
                    '"description": "Umbrella Name Service",',
                    '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(finalSvg)), '"',                    
                '}'
            )
        );

        string memory tokenUri = string(abi.encodePacked("data:application/json;base64,", json));

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUri);         

        string memory domain = string.concat(_name, ".", _tld);
        register[_tld][_name] = msg.sender;        
        names.push(domain);
        nameToIds[domain] = tokenId;
        tldCount[_tld]++;

        string[5] memory dd = [ethAddress, "", "", "", ""];
        setData(_name, _tld, dd);
        emit RegisterName(string.concat(_name, ".", _tld), msg.sender);        
    }

    function setData(string calldata _name, string calldata _tld, string[5] memory _data) public {
        if (register[_tld][_name] != msg.sender) revert Unauthorized();
        string memory name = string.concat(_name, ".", _tld);
        data[name].ethAddress = _data[0];
        data[name].btcAddress = _data[1];
        data[name].ltcAddress = _data[2];
        data[name].bnbAddress = _data[3];
        data[name].solanaAddress = _data[4];

        emit UpdateData(string.concat(_name, ".", _tld));
    } 

    function withdraw() external payable onlyOwner {
        uint bal = address(this).balance;
        payable(msg.sender).transfer(bal);
    }  

    function getNames() external view returns (string[] memory) {
        string[] memory _names = names;
        return _names;
    }

    function getTokenUri(string calldata domain) external view returns (string memory uri) {
        uint tokenId = nameToIds[domain];
        return tokenURI(tokenId);
    }

}