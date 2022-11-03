// SPDX-License-Identifier: Pytheorus
pragma solidity ^0.8.7;

/* import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol"; */
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Tambora is ERC721 {
	using Strings for uint256;
	event Request(Client indexed clientData);
	event Response(Client indexed clientData, bool indexed res);
	event Minted(uint256 indexed tokenId, address indexed addr);

	modifier onlyOwner() {
		_checkOwner();
		_;
	}

	// client types: guest, pending, approved, holder, owner, denied

	struct Client {
		string name;
		address addr;
		uint256 minted;
		uint256 mintAllowance;
		string status;
	}

	address payable private _owner;
	// string private _baseURIextended;
	uint256 public tokenId;	
	uint256 private price;
	string public contractType;
	mapping (uint256 => string) private _tokenURIs;
	mapping (address => uint256[]) private _ownedTokens;
	mapping (address => Client) public clients;
	mapping (address => Client) public pendingClients;
	Client[] private _pendingClients;
	Client[] private _clients;
	File[] private _fileStore;

	constructor(address deployer, string memory name, string memory symbol, uint256 price_, string memory contractType_, address to_, string memory uri_) ERC721(name, symbol) {
		tokenId = 0;
		_owner = payable(deployer);
		price = price_;
		contractType = contractType_;
		clients[owner()] = Client({ name: name, addr: deployer, minted: 1, mintAllowance: 200, status: 'owner' });
		mint(to_, uri_);
	}

  function owner() public view returns (address) {
		return _owner;
	}

  function _checkOwner() internal view {
		require(owner() == _msgSender(), "Ownable: caller is not the owner");
	}

	/* function setBaseURI(string memory baseURI_) external onlyOwner() { */
	/* 	_baseURIextended = baseURI_; */
	/* } */

	function _setTokenURI(uint256 tokenId_, string memory tokenURI_) internal {
		require(_exists(tokenId_), "ERC721Metadata: URI set of nonexistent token");
		_tokenURIs[tokenId_] = tokenURI_;
	}

	function tokenURI(uint256 tokenId_) public view override returns (string memory) {
		require(_exists(tokenId_), "ERC721Metadata: URI query for nonexistent token");

		string memory _tokenURI = _tokenURIs[tokenId_];
		string memory base = _baseURI();

		// If there is no base URI, return token URI
		if (bytes(base).length == 0) {
			return _tokenURI;
		}
		// If both are set, concatenate the base and token URI
		if (bytes(_tokenURI).length > 0) {


			return string(abi.encodePacked(base, _tokenURI));
		}
		// if there is a baseURI but no tokenURI, concatenate the tokenId to the base URI
		return string(abi.encodePacked(base, tokenId_.toString()));
	}

	function mint(address to_, string memory uri) public payable {
		// require(_msgValue() >= price, "Mint failed: Value of message is less than price.");
		require(tokenId < 100, "Mint failed: Tokens are sold out.");
		require(clients[to_].minted < clients[to_].mintAllowance, "Mint allowance exceeded.");
		_mint(to_, tokenId);
		_setTokenURI(tokenId, uri);
		_ownedTokens[to_].push(tokenId);
		emit Minted(tokenId, to_);
		tokenId++;
		_owner.transfer(_msgValue());
		clients[_msgSender()].minted += 1;
	}

	function getOwnedTokens(address tokenOwner) public view returns (uint256[] memory){
		return _ownedTokens[tokenOwner];
	}

	function _msgValue() internal view returns (uint256) {
		return msg.value;
	}
	
	function requestApproval(string memory name) public {
		Client memory client = Client({ name: name, addr: _msgSender(), minted: 0, mintAllowance: 0, status: 'pending' });
		_pendingClients.push(client);
		pendingClients[_msgSender()] = client;
		emit Request(client);
	}

	function getPendingClients() public view returns (Client[] memory) {
		return _pendingClients;
	}

	/* function approveClient(uint256 index) public onlyOwner { */
	/* 	_pendingClients[index].status = 'approved'; */
	/* 	clients[_msgSender()] = _clients[index]; */
	/* } */

	/* function denyClient(uint256 index) public onlyOwner { */
	/* 	_clients[index].status = 'denied'; */
	/* 	clients[_msgSender()] = _clients[index]; */
	/* } */

	function approveOrDenyClient(uint256 index, bool decision) public onlyOwner {
		Client memory client = _pendingClients[index];
		if (decision) {
			client.status = 'approved';
			_clients.push(client);
		} else {
			client.status = 'denied';
		}
		clients[client.addr] = client;
		emit Response(client, decision);
		_pendingClients[index] = _pendingClients[_pendingClients.length - 1];
		_pendingClients.pop();
	}

	function finalizeClient(string memory uri) public payable {
		require(keccak256(bytes(clients[_msgSender()].status)) == keccak256(bytes('approved')));
		clients[_msgSender()].mintAllowance = 5;
		mint(_msgSender(), uri);
		clients[_msgSender()].status = 'holder';
		_owner.transfer(_msgValue());
	}

	function getClientData() public view returns (Client memory) {
		// Client memory client = keccak256(bytes(clients[_msgSender()]));
		// Client memory pendingClient = keccak256(bytes(pendingClients[_msgSender()]));
		if (clients[_msgSender()].addr != address(0)) {
			return clients[_msgSender()];
		} else if (pendingClients[_msgSender()].addr != address(0)) {
			return pendingClients[_msgSender()];
		} else {
			return Client({ name: 'thedude', addr: _msgSender(), minted: 0, mintAllowance: 0, status: 'guest' });
		}
	}

	struct ShowData {
		uint256 tokenId;
		address manager;
		string contractType;
		string tokenURI;
		uint256 approvedCount;
		File[] fileStore;
	}

	function getShowData() public view returns (ShowData memory) {
		return ShowData({ tokenId: tokenId, manager: owner(), contractType: contractType, tokenURI: tokenURI(0), approvedCount: _clients.length, fileStore: _fileStore });
	}

	function addFileLocation(string memory name_, string memory uri_) public onlyOwner {
		File memory fileObj = File({ name: name_, uri: uri_});
		_fileStore.push(fileObj);
	}

	struct File {
		string name;
		string uri;
	}

	function getFileStore() public view returns (File[] memory) {
		require(keccak256(bytes(clients[_msgSender()].status)) == keccak256(bytes('holder')), "Client is not a holder.");
		return _fileStore;
	}
}
