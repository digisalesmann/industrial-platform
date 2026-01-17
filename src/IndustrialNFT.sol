// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import "ERC721A/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "forge-std/console.sol";

contract IndustrialNFT is ERC721A, Ownable {

    using SafeERC20 for IERC20;
    uint256 public constant MAX_SUPPLY = 10000;
    IERC20 public paymentToken;
    uint256 public mintPrice = 1 ether; // 1 Token

    constructor(string memory name_, string memory symbol_, address _token)
        ERC721A(name_, symbol_) Ownable(msg.sender)
    {
        paymentToken = IERC20(_token);
    }

    function mint(uint256 quantity) external whenNotPaused {
        console.log("NFT: mint called");
        console.log("NFT: totalSupply:", totalSupply());
        console.log("NFT: quantity:", quantity);
        require(totalSupply() + quantity <= MAX_SUPPLY, "EXCEEDS_MAX_SUPPLY");
        console.log("NFT: supply check passed");
        uint256 totalCost = mintPrice * quantity;
        console.log("NFT: totalCost calculated", totalCost);
        console.log("NFT: msg.sender tokenB balance:", paymentToken.balanceOf(msg.sender));
        console.log("NFT: msg.sender tokenB allowance:", paymentToken.allowance(msg.sender, address(this)));
        paymentToken.safeTransferFrom(msg.sender, address(this), totalCost);
        console.log("NFT: token payment transferred");
        _mint(tx.origin, quantity);
        console.log("NFT: mint successful");
    }
    using Strings for uint256;
    string public baseURI;
    bool public paused = false;

    modifier whenNotPaused() {
        console.log("NFT: whenNotPaused modifier, paused:", paused);
        require(!paused, "MINT_PAUSED");
        _;
    }


    // Owner functions for industrial control
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function setPaused(bool _state) external onlyOwner {
        paused = _state;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "TRANSFER_FAILED");
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}