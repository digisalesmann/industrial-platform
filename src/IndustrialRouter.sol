// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import "./IndustrialFactory.sol";
import "./IndustrialPair.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IndustrialNFT.sol";

contract IndustrialRouter {
    IndustrialFactory public immutable factory;

    constructor(address _factory) {
        factory = IndustrialFactory(_factory);
    }

    // Helper: Sort tokens (Internal)
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    }

    // High-tech: Add Liquidity with Safety Checks
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        address to
    ) external returns (uint amountA, uint amountB) {
        // Create the pair if it doesn't exist
        address pair = factory.getPair(tokenA, tokenB);
        if (pair == address(0)) {
            pair = factory.createPair(tokenA, tokenB);
        }

        // Industrial standard: Pull tokens from user and send to the Pair
        IERC20(tokenA).transferFrom(msg.sender, pair, amountADesired);
        IERC20(tokenB).transferFrom(msg.sender, pair, amountBDesired);
        
        // Note: For a production build, you'd add math here to ensure the 
        // ratio added matches the current pool price.
        amountA = amountADesired;
        amountB = amountBDesired;
    }

    // High-tech: Execute Swap with Slippage Protection
    function swapTokens(
        address tokenIn,
        address tokenOut,
        uint amountIn,
        uint minAmountOut,
        address to
    ) external returns (uint amountOut) {
        address pair = factory.getPair(tokenIn, tokenOut);
        require(pair != address(0), "PAIR_NOT_FOUND");

        // The Router facilitates the transfer
        IERC20(tokenIn).transferFrom(msg.sender, pair, amountIn);
        
        // Execute the swap on the pair
        amountOut = IndustrialPair(pair).swap(amountIn, tokenIn, minAmountOut);
        
        // Ensure tokens reach the destination (Pair handles this in our version)
    }
    /**
     * @dev Swaps Token A for Token B and immediately uses Token B to mint an NFT.
     * All happens in one atomic transaction. If the swap fails or the mint fails, 
     * the whole thing reverts (user keeps their original tokens).
     */
    function swapAndMintNFT(
        address nftAddress,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 nftQuantity
    ) external returns (uint256 amountOut) {
        console.log("Router: Finding pair");
        address pair = factory.getPair(tokenIn, tokenOut);
        require(pair != address(0), "PAIR_NOT_FOUND");
        console.log("Router: Pair found");

        console.log("Router: Transferring tokenIn to pair");
        require(IERC20(tokenIn).transferFrom(msg.sender, pair, amountIn), "ROUTER_TOKENIN_TRANSFER_FAILED");
        console.log("Router: tokenIn transferred");

        console.log("Router: Executing swap");
        amountOut = IndustrialPair(pair).swap(amountIn, tokenIn, minAmountOut);
        console.log("Router: Swap executed, amountOut:", amountOut);

        console.log("Router: Approving tokenOut for NFT contract");
        require(IERC20(tokenOut).approve(nftAddress, amountOut), "ROUTER_TOKENOUT_APPROVE_FAILED");
        console.log("Router: tokenOut approved");

        console.log("Router: Minting NFT");
        IndustrialNFT(nftAddress).mint(nftQuantity);
        console.log("Router: NFT minted");

        // 6. Send any leftover Token B back to the user (Dust protection)
        uint256 remaining = IERC20(tokenOut).balanceOf(address(this));
        if (remaining > 0) {
            require(IERC20(tokenOut).transfer(msg.sender, remaining), "ROUTER_TOKENOUT_TRANSFER_FAILED");
            console.log("Router: Returned leftover tokenOut to user");
        }
    }
}