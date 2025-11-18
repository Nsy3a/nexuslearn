// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KnowledgeNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    struct Metadata {
        string contentHash; // IPFS hash
        string summary;
        address[] contributors;
        uint256[] shares;
        string demandId;
    }

    mapping(uint256 => Metadata) public metadataOf;

    event KnowledgeMinted(uint256 indexed tokenId, string indexed demandId, string contentHash);

    constructor(address initialOwner) ERC721("KnowledgeNFT", "KNFT") {
        _transferOwnership(initialOwner);
    }

    function mintKnowledge(
        address to,
        string memory _contentHash,
        string memory _summary,
        address[] memory _contributors,
        uint256[] memory _shares,
        string memory _demandId,
        string memory _tokenURI
    ) external returns (uint256) {
        require(_contributors.length == _shares.length, "Length mismatch");
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        metadataOf[tokenId] = Metadata({
            contentHash: _contentHash,
            summary: _summary,
            contributors: _contributors,
            shares: _shares,
            demandId: _demandId
        });
        emit KnowledgeMinted(tokenId, _demandId, _contentHash);
        return tokenId;
    }
}
