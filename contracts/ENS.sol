// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import {StringUtils} from "./libraries/StringUtils.sol";

string constant svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
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

    function setName(string calldata _name, string calldata _tld) external payable {
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

        register[_tld][_name] = msg.sender;        
        names.push(string.concat(_name, ".", _tld));
        tldCount[_tld]++;

        emit RegisterName(string.concat(_name, ".", _tld), msg.sender);
    }

    function setData(string calldata _name, string calldata _tld, string[] calldata _data) external {
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

}