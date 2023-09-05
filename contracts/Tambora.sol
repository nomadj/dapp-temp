// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Tambora is ERC721Enumerable {
	using Strings for uint256;
	event Request(string indexed name, address indexed addr);
	event Response(string indexed name, address indexed addr, bool indexed res);
	event FileAdded(string indexed name);

	address payable private _factoryOwner;
	address payable public owner;
	uint256 public mintFee;
	uint256 public contractFee;
	uint256 private _tokenId;	
	uint256 public price;
	uint256 public totalCost;
	uint256 public mintAllowance;
	uint256 public allottedAmount;
	string public contractType;
	mapping (uint256 => string) private _tokenURIs;
	mapping (address => bool) public isPending;
	mapping (address => bool) public isApproved;
	mapping (address => string) public approvedName;
	mapping (uint256 => ClientToken) public memberTokens;
	mapping (uint256 => Token) private _allTokens;
	mapping (address => bool) private _mintIncreaseApproved;
	Client[] private _mintIncreaseRequests;
	Client[] private _pendingClients;
	File[] private _fileStore;

	struct ClientToken {
		uint256 mintId;
		uint256 minted;
		uint256 mintAllowance;
	}
	struct Client {
	  string name;
		address addr;
	}
	struct Token {
		uint256 blockNumber;
		uint256 timeStamp;
		string uri;
	}
	struct ShowData {
		uint256 tokenId;
		address manager;
		string contractType;
		string tokenURI;
		File[] fileStore;
	}
	struct File {
		string name;
		string uri;
	}	

	constructor(address deployer, string memory name, string memory symbol, uint256 price_, string memory contractType_, address to_, string memory uri_, address factoryOwner_, uint256 mintFee_, uint256 contractFee_) ERC721(name, symbol) {
		owner = payable(deployer);
		_factoryOwner = payable(factoryOwner_);
		price = price_;
		mintFee = mintFee_;
		totalCost = price_ + mintFee_;
		contractFee = contractFee_;
		contractType = contractType_;
		allottedAmount = 10;
		mintAllowance = 90; 
		memberTokens[0] = ClientToken({ minted: 1, mintAllowance: 10, mintId: 0 });
		_mint(to_, 0);
		_setTokenURI(0, uri_);
		_tokenId = 1;
		_allTokens[0] = Token({ blockNumber: block.number, timeStamp: block.timestamp, uri: uri_ });
	}

	modifier onlyOwner() {
		_checkOwner();
		_;
	}

  function _checkOwner() internal view {
		require(owner == _msgSender(), "Ownable: caller is not the owner");
	}

	function _setTokenURI(uint256 tokenId_, string memory tokenURI_) internal {
		require(_exists(tokenId_), "ERC721Metadata: URI set of nonexistent token");
		_tokenURIs[tokenId_] = tokenURI_;
	}

	function tokenURI(uint256 tokenId_) public view override returns (string memory) {
		require(_exists(tokenId_), "ERC721Metadata: URI query for nonexistent token");
		string memory _tokenURI = _tokenURIs[tokenId_];
		string memory base = _baseURI();

		if (bytes(base).length == 0) {
			return _tokenURI;
		}
		
		if (bytes(_tokenURI).length > 0) {
			return string(abi.encodePacked(base, _tokenURI));
		}
		return string(abi.encodePacked(base, tokenId_.toString()));
	}

	function mint(address to_, string memory uri, uint256 mintId_) public payable {
		require(_msgValue() >= totalCost, "Mint failed: Insufficient funds.");
		require(_msgValue() >= mintFee);
		require(_tokenId < 100, "Mint failed: Contract has reached it's mint allowance.");
		require(ownerOf(mintId_) == _msgSender());
		require(memberTokens[mintId_].minted < memberTokens[mintId_].mintAllowance, "Mint failed: Allowance exceeded.");
		_mint(to_, _tokenId);
		_setTokenURI(_tokenId, uri);
		_allTokens[_tokenId] = Token({ blockNumber: block.number, timeStamp: block.timestamp, uri: uri });
		_tokenId++;
		uint256 msgValue = _msgValue();
		uint256 factoryFee = msgValue - price;
		owner.transfer(price);
		_factoryOwner.transfer(factoryFee);
		memberTokens[mintId_].minted += 1;
	}

	function _msgValue() internal view returns (uint256) {
		return msg.value;
	}
	
	function requestApproval(string memory name) public {
		Client memory client = Client({ name: name, addr: _msgSender() });
		_pendingClients.push(client);
		isPending[_msgSender()] = true;
		emit Request(name, _msgSender());
	}

	function getPendingClients() public view returns (Client[] memory) {
		return _pendingClients;
	}

	function approveOrDenyClient(uint256 index, bool decision) public onlyOwner {
		require(mintAllowance >= 5);
		Client memory client = _pendingClients[index];
		if (decision) {
			isApproved[client.addr] = true;
			approvedName[client.addr] = client.name;
		}
		_pendingClients[index] = _pendingClients[_pendingClients.length - 1];
		_pendingClients.pop();
		delete isPending[client.addr];
		emit Response(client.name, client.addr, decision);
	}

	function finalizeClient(string memory uri) public payable {
		require(isApproved[_msgSender()], "Client has not been approved.");
		require(mintAllowance >= 5);
		memberTokens[_tokenId] = ClientToken({ minted: 1, mintAllowance: 5, mintId: _tokenId });
		_mint(_msgSender(), _tokenId);
		_setTokenURI(_tokenId, uri);
		_allTokens[_tokenId] = Token({ blockNumber: block.number, timeStamp: block.timestamp, uri: uri});
		_tokenId++;
		owner.transfer(_msgValue());
		mintAllowance -= 5;
		delete isApproved[_msgSender()];
		delete approvedName[_msgSender()];
	}

	function getShowData() public view returns (ShowData memory) {
		return ShowData({ tokenId: _tokenId, manager: owner, contractType: contractType, tokenURI: tokenURI(0), fileStore: _fileStore });
	}

	function addFileLocation(string memory name_, string memory uri_) public onlyOwner {
		File memory fileObj = File({ name: name_, uri: uri_});
		_fileStore.push(fileObj);
		emit FileAdded(name_);
	}

	function getFileStore() public view returns (File[] memory) {
		require(balanceOf(_msgSender()) > 0);
		return _fileStore;
	}

	function requestMintIncrease(uint256 mintId_, string memory name_) public {
		require(ownerOf(mintId_) == _msgSender());
		Client memory client = Client({ name: name_, addr: _msgSender() });
		_mintIncreaseRequests.push(client);
		emit Request(name_, _msgSender());
	}

	function getMintRequests() public view onlyOwner returns (Client[] memory) {
		return _mintIncreaseRequests;
	}

	function approveMintIncrease(uint256 index_) public onlyOwner {
		require(allottedAmount < mintAllowance, "This contract has reached it's mint allowance.");
		_mintIncreaseApproved[_mintIncreaseRequests[index_].addr] = true;
		_mintIncreaseRequests[index_] = _mintIncreaseRequests[_mintIncreaseRequests.length - 1];
		_mintIncreaseRequests.pop();				
	}

	function finalizeMintIncrease(uint256 mintId_) public payable {
		require(_mintIncreaseApproved[_msgSender()] == true, "You are not approved.");
		require(_msgValue() >= price);
		memberTokens[mintId_].mintAllowance += 5;
		allottedAmount += 5;
		mintAllowance -= 5;
		owner.transfer(_msgValue());
	}

	function denyMintIncrease(uint256 index_) public onlyOwner {
		_mintIncreaseRequests[index_] = _mintIncreaseRequests[_mintIncreaseRequests.length - 1];
		_mintIncreaseRequests.pop();
	}

	function increaseContractMintAllowance() public payable onlyOwner {
		require(_msgValue() >= contractFee, "Insufficient funds.");
		mintAllowance += 100; 
		_factoryOwner.transfer(_msgValue());
	}

	function getTokenData(uint256 id_) public view returns (Token memory) {
		return _allTokens[id_];
	}
}
