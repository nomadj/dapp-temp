// SPDX-License-Identifier: Pytheorus
pragma solidity ^0.8.7;

/* import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol"; */
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TestTambora is ERC721Enumerable {
	using Strings for uint256;
	event Request(Client indexed clientData);
	event Response(Client indexed clientData, bool indexed res);

	modifier onlyOwner() {
		_checkOwner();
		_;
	}

	address payable private _factoryOwner;
	address payable private _owner;
	uint256 private _tokenId;	
	uint256 public price;
	uint256 private _mintAllowance;
	uint256 private _allottedAmount;
	string public contractType;
	mapping (uint256 => string) private _tokenURIs;
	mapping (address => bool) public isPending;
	mapping (address => bool) public isApproved;
	mapping (uint256 => File[]) private _individualFiles;
	mapping (uint256 => ClientToken) private _memberTokens;
	Client[] private _pendingClients;
	File[] private _fileStore;

	struct ClientToken {
		uint256 minted;
		uint256 mintAllowance;
	}
	struct Client {
	  string name;
		address addr;
	}
	struct ShowData {
		uint256 tokenId;
		address manager;
		string contractType;
		string tokenURI;
		File[] fileStore;
		File[] individualFilestore;
	}
	struct File {
		string name;
		string uri;
	}	

	constructor(address deployer, string memory name, string memory symbol, uint256 price_, string memory contractType_, address to_, string memory uri_, address factoryOwner_) ERC721(name, symbol) {
		_tokenId = 0;
		_owner = payable(deployer);
		_factoryOwner = payable(factoryOwner_);
		price = price_;
		contractType = contractType_;
		_allottedAmount = 10;
		_memberTokens[0] = ClientToken({ minted: 1, mintAllowance: 10 });
		
		mint(to_, uri_, 0);
	}

  function owner() public view returns (address) {
		return _owner;
	}

  function _checkOwner() internal view {
		require(owner() == _msgSender(), "Ownable: caller is not the owner");
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
		// require(_msgValue() >= price, "Mint failed: Value of message is less than price.");
		require(_tokenId < 100, "Mint failed: Tokens are sold out.");
		require(ownerOf(mintId_) == _msgSender());
		require(_memberTokens[mintId_].minted < _memberTokens[mintId_].mintAllowance, "Mint allowance exceeded.");
		_mint(to_, _tokenId);
		_setTokenURI(_tokenId, uri);
		_tokenId++;
		_owner.transfer(_msgValue());
		_memberTokens[mintId_].minted += 1;
	}

	function _msgValue() internal view returns (uint256) {
		return msg.value;
	}
	
	function requestApproval(string memory name) public {
		Client memory client = Client({ name: name, addr: _msgSender() });
		_pendingClients.push(client);
		isPending[_msgSender()] = true;
		emit Request(client);
	}

	function getPendingClients() public view returns (Client[] memory) {
		return _pendingClients;
	}

	function approveOrDenyClient(uint256 index, bool decision) public onlyOwner {
		Client memory client = _pendingClients[index];
		if (decision) {
			isApproved[client.addr] = true;
		}
		emit Response(client, decision);
		_pendingClients[index] = _pendingClients[_pendingClients.length - 1];
		_pendingClients.pop();
		delete isPending[client.addr];
	}

	function finalizeClient(string memory uri) public payable {
		require(isApproved[_msgSender()], "Client has not been approved.");
		_memberTokens[_tokenId] = ClientToken({ minted: 1, mintAllowance: 5 });
		_mint(_msgSender(), _tokenId);
		_setTokenURI(_tokenId, uri);
		_tokenId++;
		_owner.transfer(_msgValue());
		delete isApproved[_msgSender()];
	}

	function getShowData() public view returns (ShowData memory) {
		return ShowData({ tokenId: _tokenId, manager: owner(), contractType: contractType, tokenURI: tokenURI(0), fileStore: _fileStore, individualFilestore: _individualFiles[0] });
	}

	function addFileLocation(string memory name_, string memory uri_) public onlyOwner {
		File memory fileObj = File({ name: name_, uri: uri_});
		_fileStore.push(fileObj);
	}

	function getFileStore() public view returns (File[] memory) {
		require(balanceOf(_msgSender()) > 0);
		return _fileStore;
	}

	function increaseClientMintAllowance(uint256 mintId_) public payable onlyOwner {
		require(_allottedAmount < _mintAllowance, "This contract has reached it's mint allowance.");
		_memberTokens[mintId_].mintAllowance += 5;
		_allottedAmount += 5;
	}

	function increaseContractMintAllowance() public payable onlyOwner {
		require(_msgValue() >= 0.04 ether, "This transaction requires 0.04 ether");
		_mintAllowance += 100;
		_factoryOwner.transfer(_msgValue());
	}

	function addIndividualFile(string memory uri_, string memory name_, uint256 mintId_) public onlyOwner {
		_individualFiles[mintId_].push(File({name: name_, uri: uri_}));
	}
}
