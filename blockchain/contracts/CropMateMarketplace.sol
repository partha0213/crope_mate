// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CropMateMarketplace is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct CropListing {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool sold;
        string cropType;
        string quality;
        uint256 quantity;
        uint256 harvestDate;
    }
    
    mapping(uint256 => CropListing) public cropListings;
    mapping(uint256 => bool) public disputedListings;
    
    event CropListed(uint256 tokenId, address seller, uint256 price);
    event CropSold(uint256 tokenId, address seller, address buyer, uint256 price);
    event DisputeRaised(uint256 tokenId, address disputeRaiser, string reason);
    event DisputeResolved(uint256 tokenId, bool sellerFavored);
    
    constructor() ERC721("CropMate NFT", "CROP") {}
    
    function listCrop(
        string memory tokenURI,
        uint256 price,
        string memory cropType,
        string memory quality,
        uint256 quantity,
        uint256 harvestDate
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        cropListings[newTokenId] = CropListing(
            newTokenId,
            payable(msg.sender),
            price,
            false,
            cropType,
            quality,
            quantity,
            harvestDate
        );
        
        emit CropListed(newTokenId, msg.sender, price);
        return newTokenId;
    }
    
    function buyCrop(uint256 tokenId) public payable {
        CropListing storage listing = cropListings[tokenId];
        require(!listing.sold, "Crop already sold");
        require(!disputedListings[tokenId], "Crop is currently disputed");
        require(msg.value >= listing.price, "Insufficient payment");
        
        listing.sold = true;
        
        _transfer(listing.seller, msg.sender, tokenId);
        listing.seller.transfer(msg.value);
        
        emit CropSold(tokenId, listing.seller, msg.sender, listing.price);
    }
    
    function raiseDispute(uint256 tokenId, string memory reason) public {
        require(ownerOf(tokenId) == msg.sender, "Only the buyer can raise a dispute");
        require(!disputedListings[tokenId], "Dispute already raised");
        
        disputedListings[tokenId] = true;
        emit DisputeRaised(tokenId, msg.sender, reason);
    }
    
    function resolveDispute(uint256 tokenId, bool sellerFavored) public onlyOwner {
        require(disputedListings[tokenId], "No dispute raised for this token");
        
        disputedListings[tokenId] = false;
        emit DisputeResolved(tokenId, sellerFavored);
    }
}