// SPDX-License-Identifier: Pytheorus
pragma solidity ^0.8.7;

import "./Tambora.sol";

contract TamboraFactory {
	event Deployed(Tambora indexed contractAddr);
	uint256 public mintFee;
	uint256 public contractFee;
	address payable private _owner;
	Tambora[] private _contracts;
	string[] public names;
	mapping (address => Tambora[]) private _ownedContracts;
	mapping (string => Tambora) private _contractName;

	constructor() {
		_owner = payable(_msgSender());
		mintFee = 0.0005 ether;
		contractFee = 0.05 ether;
	}
	
	function deployTambora(string memory name, string memory symbol, uint256 price_, string memory contractType_, address to_, string memory uri_, uint256 mintFee_, uint256 contractFee_) public payable {
		require(_msgValue() >= contractFee);
		require(address(getContractAddress(name)) == address(0), "Name already exists");
		Tambora newContract = new Tambora(_msgSender(), name, symbol, price_, contractType_, to_, uri_, _owner, mintFee_, contractFee_);
		_contracts.push(newContract);
		names.push(name);
		_contractName[name] = newContract;
		emit Deployed(newContract);
		_ownedContracts[_msgSender()].push(newContract);
		_owner.transfer(_msgValue());
	}
	function getNames() public view returns (string[] memory) {
		return names;
	}
	function getContractAddress(string memory name_) public view returns (Tambora) {
		return _contractName[name_];
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
	function owner() private view returns (address) {
		return _owner;
	}
	function _changeFees(uint256 mintFee_, uint256 contractFee_) internal {
		mintFee = mintFee_;
		contractFee = contractFee_;
	}
	function changeFees(uint256 mintFee_, uint256 contractFee_) public {
		require(_msgSender() == _owner);
		_changeFees(mintFee_, contractFee_);
	}
}
