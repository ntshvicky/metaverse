// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";
import "./IERC2981.sol";

contract metaverse is ERC721, DefaultOperatorFilterer, IERC2981, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private supply;

    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant COST = 0.001 ether;

    //Owners and properties in this metaverse
    mapping(address => Building[]) NFTOwners;

    struct Building {
        string name;
        int8 w;
        int8 h;
        int8 d;
        int8 x;
        int8 y;
        int8 z;
    }

    Building[] public buildings;

    address public royaltyReceiver;

    constructor() ERC721("GBWBH_METAVERSE", "GBWBH_META") {
        royaltyReceiver = msg.sender;
    }

    // Obtaining the buildings made in the metaverse
    function getBuildings() public view returns (Building[] memory) {
        return buildings;
    }

    // Obtaining the buildings made in the metaverse
    function getOwnerBuildings(address propertyOwner) public view returns (Building[] memory) {
        return NFTOwners[propertyOwner];
    }

    // Current supply of NFT Token
    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    // Creation of building in metaverse
    function mint(string memory _building_name, int8 _w, int8 _h, int8 _d, int8 _x, int8 _y, int8 _z) public payable {
        require(totalSupply() <= MAX_SUPPLY, "Max supply exceeded!");
        require(msg.value >= COST, "Insuficient funds!");
        supply.increment();
        _safeMint(msg.sender, totalSupply());
        Building memory _newBuild = Building(_building_name, _w,_h,_d,_x,_y,_z);
        buildings.push(_newBuild);
        NFTOwners[msg.sender].push(_newBuild);
    }

    function withdraw() external payable onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "transfer failed.");
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(
          _exists(_tokenId),
          "ERC721Metadata: URI query for nonexistent token"
        );

        uint256 _royaltyAmount = (_salePrice * 100) / 10000; //1% is 100
        assert(_royaltyAmount < _salePrice);

        return (royaltyReceiver, _royaltyAmount);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }


    //setup for creator earning on opensea
    function setApprovalForAll(address operator, bool approved) public override onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    function approve(address operator, uint256 tokenId) public override onlyAllowedOperatorApproval(operator) {
        super.approve(operator, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public
        override
        onlyAllowedOperator(from)
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }
}