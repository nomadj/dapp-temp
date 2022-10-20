// SPDX-License-Identifier: Pytheorus
pragma solidity ^0.8.7;

/* import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol"; */
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Tambora is ERC721 {
	using Strings for uint256;

	modifier onlyOwner() {
		_checkOwner();
		_;
	}

	address payable private _owner;
	uint256 private _tokenId;
	string private _baseURIextended;
	uint256 public price;
	string public contractType;
	mapping (uint256 => string) private _tokenURIs;
	mapping (address => uint256[]) private _ownedTokens;

	constructor(address deployer, string memory name, string memory symbol, uint256 price_, string memory type_, address to_, string memory uri_) ERC721(name, symbol) {
		_tokenId = 0;
		_owner = payable(deployer);
		price = price_;
		contractType = type_;
		mint(to_, uri_);
	}

  function owner() public view returns (address) {
		return _owner;
	}

  function _checkOwner() internal view {
		require(owner() == _msgSender(), "Ownable: caller is not the owner");
	}

	function setBaseURI(string memory baseURI_) external onlyOwner() {
		_baseURIextended = baseURI_;
	}

	function _setTokenURI(uint256 tokenId, string memory tokenURI_) internal {
		require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
		_tokenURIs[tokenId] = tokenURI_;
	}

	function tokenURI(uint256 tokenId) public view override returns (string memory) {
		require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

		string memory _tokenURI = _tokenURIs[tokenId];
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
		return string(abi.encodePacked(base, tokenId.toString()));
	}

	function mint(address to_ string memory uri) public payable {
		// require(_msgValue() >= price, "Mint failed: Value of message is less than price.");
		require(_tokenId < 500, "Mint failed: Tokens are sold out.");
		_mint(to_, _tokenId);
		_setTokenURI(_tokenId, uri);
		_ownedTokens[to_].push(_tokenId);
		_tokenId++;
		_owner.transfer(_msgValue());
	}

	function getOwnedTokens(address tokenOwner) public view returns (uint256[] memory){
		return _ownedTokens[tokenOwner];
	}

	function _msgValue() internal view returns (uint256) {
		return msg.value;
	}
}
