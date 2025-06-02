const hre = require("hardhat");

async function main() {
    console.log("\n🚀 Deploying token to Base Mainnet...");
    
    const [deployer] = await ethers.getSigners();
    console.log("\nDeploying with account:", deployer.address);
    
    const balance = await deployer.provider.getBalance(deployer.address);
    const ethBalance = ethers.formatEther(balance);
    console.log(`Account balance: ${ethBalance} ETH\n`);

    // Generate token name
    const prefixes = ['eco', 'bio', 'sky', 'sea', 'geo', 'sun', 'moon', 'star'];
    const suffixes = ['ix', 'um', 'on', 'ia'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const tokenName = prefix + suffix;
    const tokenSymbol = (prefix[0] + suffix.substring(0, 2)).toUpperCase();
    const initialSupply = 1000000; // 1 million tokens

    console.log("Token Details:");
    console.log(`Name: ${tokenName}`);
    console.log(`Symbol: ${tokenSymbol}`);
    console.log(`Initial Supply: ${initialSupply.toLocaleString()} tokens\n`);

    try {
        // Deploy token
        const BaseToken = await ethers.getContractFactory("BaseToken");
        const token = await BaseToken.deploy(tokenName, tokenSymbol, initialSupply);
        
        console.log("Deploying... please wait");
        await token.waitForDeployment();
        
        const tokenAddress = await token.getAddress();
        console.log(`\n✅ Token deployed to: ${tokenAddress}`);
        console.log(`View on Base Explorer: https://basescan.org/address/${tokenAddress}\n`);

        // Wait for block confirmations
        console.log("Waiting 30 seconds before verification...");
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Verify contract
        console.log("\nVerifying contract on BaseScan...");
        try {
            await hre.run("verify:verify", {
                address: tokenAddress,
                constructorArguments: [tokenName, tokenSymbol, initialSupply],
            });
            console.log("✅ Contract verified successfully!");
        } catch (error) {
            if (error.message.includes("already verified")) {
                console.log("✅ Contract was already verified!");
            } else {
                console.error("❌ Verification error:", error.message);
            }
        }
    } catch (error) {
        console.error("\n❌ Deployment failed:", error.message);
        return;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
