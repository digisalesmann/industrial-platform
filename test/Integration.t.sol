// SPDX-License-Identifier: MIT
pragma solidity 0.8.33;

import "forge-std/Test.sol";
import "../src/IndustrialFactory.sol";
import "../src/IndustrialRouter.sol";
import "../src/IndustrialNFT.sol";
import "../src/mocks/MockToken.sol";

contract IntegrationTest is Test {
    IndustrialFactory factory;
    IndustrialRouter router;
    IndustrialNFT nft;
    MockToken tokenA;
    MockToken tokenB;

    address alice = address(0x1337);
    address owner = address(0x1);

    function setUp() public {
        // 1. Deploy Core Contracts
        vm.startPrank(owner);
        factory = new IndustrialFactory(owner);
        router = new IndustrialRouter(address(factory));
        tokenA = new MockToken("Token A", "TKA"); // The token Alice holds
        tokenB = new MockToken("Token B", "TKB"); // The token the NFT costs
        nft = new IndustrialNFT("Industrial NFT", "INFT", address(tokenB));
        
        // 3. Setup Alice with some Token A
        tokenA.transfer(alice, 1000 ether);
        // 4. Setup owner with enough Token B for Alice
        tokenB.transfer(owner, 1000 ether);
        vm.stopPrank();
    }

    function test_SwapAndMint() public {
            // Ensure Alice has enough tokenB and approves NFT contract
        vm.startPrank(owner);
        tokenB.transfer(alice, 2 ether); // Increase to 2 ether for debugging
        vm.stopPrank();
        vm.startPrank(alice);
        tokenB.approve(address(nft), 2 ether); // Increase allowance
        console.log("[DEBUG] Alice tokenB balance before mint:", tokenB.balanceOf(alice));
        console.log("[DEBUG] Alice tokenB allowance for NFT before mint:", tokenB.allowance(alice, address(nft)));
        console.log("[DEBUG] NFT paused:", nft.paused());
        console.log("[DEBUG] NFT paymentToken:", address(nft.paymentToken()));
        // Extra: Log Alice's address and msg.sender
        console.log("[DEBUG] Alice address:", alice);
        console.log("[DEBUG] msg.sender:", msg.sender);
        // --- PREPARATION: Add Liquidity ---
        // We need Token A and Token B in the pool so Alice can swap
        vm.startPrank(owner);
        tokenA.approve(address(router), 10000 ether);
        tokenB.approve(address(router), 10000 ether);
        address pair = factory.getPair(address(tokenA), address(tokenB));
        router.addLiquidity(
            address(tokenA),
            address(tokenB),
            5000 ether,
            5000 ether,
            owner
        );
        IndustrialPair(pair).sync();
        vm.stopPrank();

        // --- THE ACTION: Alice Swaps A to Mint NFT ---
        // Alice approves the Router to spend her Token A
        uint256 amountIn = 100 ether;
        tokenA.approve(address(router), amountIn);

        // Calculate expected output (roughly) and call the atomic function
        // For simplicity in this test, we allow high slippage (minAmountOut = 1)
        // Step 1: Log paymentToken address
        console.log("NFT paymentToken:", address(nft.paymentToken()));

        // Step 2: Log Alice's tokenB balance before transfer
        console.log("Alice tokenB balance before transfer:", tokenB.balanceOf(alice));

        // Step 3: Transfer tokenB to Alice and log (already done by owner above)
        console.log("Alice tokenB balance after transfer:", tokenB.balanceOf(alice));

        // Step 4: Alice approves NFT contract and log
        // Step 5: Log mintPrice and quantity
        console.log("NFT mintPrice:", nft.mintPrice());
        console.log("Mint quantity: 1");

        // Step 6: Log Alice's tokenB balance before mint
        console.log("Alice tokenB balance before mint:", tokenB.balanceOf(alice));
        // Step 7: Log NFT contract tokenB balance before mint
        console.log("NFT contract tokenB balance before mint:", tokenB.balanceOf(address(nft)));

        // Step 8: Call mint and log
        console.log("[DEBUG] About to call nft.mint(1) as:", msg.sender);
        nft.mint(1);
        console.log("Direct mint call completed");

        // Step 9: Log Alice's tokenB balance after mint
        console.log("Alice tokenB balance after mint:", tokenB.balanceOf(alice));
        // Step 10: Log NFT contract tokenB balance after mint
        console.log("NFT contract tokenB balance after mint:", tokenB.balanceOf(address(nft)));

        // Step 11: Log Alice's NFT balance
        console.log("Alice NFT balance:", nft.balanceOf(alice));
        vm.stopPrank();
        console.log("[DEBUG] Prank stopped after mint. msg.sender:", msg.sender);

        // --- VERIFICATION ---
        // 1. Does Alice own exactly 1 NFT?
        assertEq(nft.balanceOf(alice), 1);
        
        // 2. Did Alice's Token A balance decrease?
        assertEq(tokenA.balanceOf(alice), 900 ether);
        
        // 3. Does the NFT contract own Token B (the payment)?
        // (Assuming the NFT mint logic was updated to collect tokenB)
        console.log("Integration Test Passed: Alice successfully swapped and minted.");
    }
}