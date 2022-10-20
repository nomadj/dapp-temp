// SPDX-License-Identifier: Pytheorus
pragma solidity ^0.8.7;

import "./Tambora.sol";

contract TamboraFactory {
	event Deployed(Tambora indexed contractAddr);
	address payable private _owner;
	Tambora[] private _contracts;
	string[] public names;
	mapping (address => Tambora[]) private _ownedContracts;

	constructor() {
		_owner = payable(_msgSender());
	}

	function deployTambora(string memory name, string memory symbol, uint256 price_, string memory type_, address to_, string memory uri_) public payable {
		// require(_msgValue() >= 0.033 ether);
		Tambora newContract = new Tambora(_msgSender(), name, symbol, price_, type_, to_, uri_);
		_contracts.push(newContract);
		names.push(name);
		emit Deployed(newContract);
		_ownedContracts[_msgSender()].push(newContract);
		_owner.transfer(_msgValue());
	}
	function getNames() public view returns (string[] memory) {
		return names;
	}
	function getDeployedContracts() public view returns (Tambora[] memory) {
		return _contracts;
	}

	function getOwnedContracts(address contractOwner) public view returns (Tambora[] memory) {
		return _ownedContracts[contractOwner];
	}

	function _msgSender() internal view returns (address) {
		return msg.sender;
	}

	function _msgValue() internal view returns (uint256) {
		return msg.value;
	}
}
