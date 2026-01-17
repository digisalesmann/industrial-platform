// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract IndustrialPair is ReentrancyGuard {
        function sync() external {
            _updateReserves();
        }
    using SafeERC20 for IERC20;

    address public factory;
    address public token0;
    address public token1;

    uint256 private reserve0;
    uint256 private reserve1;

    event Swap(address indexed sender, uint amountIn, uint amountOut, address indexed to);
    event Sync(uint256 reserve0, uint256 reserve1);

    constructor() {
        factory = msg.sender;
    }

    // Called once by the factory at time of deployment
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, "FORBIDDEN"); 
        token0 = _token0;
        token1 = _token1;
    }

    // High-tech Swap execution
    function swap(uint amountIn, address tokenIn, uint minAmountOut) external nonReentrant returns (uint amountOut) {
        require(tokenIn == token0 || tokenIn == token1, "INVALID_TOKEN");
        
        bool isToken0 = tokenIn == token0;
        (uint rIn, uint rOut) = isToken0 ? (reserve0, reserve1) : (reserve1, reserve0);

        // Constant Product Math with 0.3% Fee
        uint amountInWithFee = (amountIn * 997);
        uint numerator = amountInWithFee * rOut;
        uint denominator = (rIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
        
        require(amountOut >= minAmountOut, "SLIPPAGE_EXCEEDED");

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(isToken0 ? token1 : token0).safeTransfer(msg.sender, amountOut);

        _updateReserves();
        emit Swap(msg.sender, amountIn, amountOut, msg.sender);
    }

    function _updateReserves() internal {
        reserve0 = IERC20(token0).balanceOf(address(this));
        reserve1 = IERC20(token1).balanceOf(address(this));
        emit Sync(reserve0, reserve1);
    }

    // Helper to view current reserves
    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1) {
        return (reserve0, reserve1);
    }
}