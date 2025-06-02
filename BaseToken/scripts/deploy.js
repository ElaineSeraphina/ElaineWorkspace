const hre = require("hardhat");

// Nature-themed word parts to generate names
const prefixes = ['sea', 'sky', 'eco', 'geo', 'bio', 'air', 'sun', 'moon', 'star', 'leaf'];
const suffixes = ['ia', 'ex', 'on', 'um', 'us', 'ix'];

function generateTokenName() {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const name = prefix + suffix;
  // Create symbol from the first letter of prefix and the first 2-3 letters of suffix
  const symbol = (prefix[0] + suffix.substring(0, Math.min(2, suffix.length))).toUpperCase();
  return { name, symbol };
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const BaseToken = await hre.ethers.getContractFactory("BaseToken");
  
  for (let i = 0; i < 100; i++) {
    const { name, symbol } = generateTokenName();
    const initialSupply = 1000000; // 1 million tokens
    
    console.log(`\nDeploying token #${i + 1}:`);
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    
    const token = await BaseToken.deploy(name, symbol, initialSupply);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    
    console.log(`Token deployed to: ${tokenAddress}`);
    
    // Verify the contract
    console.log("Waiting for a few block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds for block confirmations
    
    try {
      await hre.run("verify:verify", {
        address: tokenAddress,
        constructorArguments: [name, symbol, initialSupply],
      });
      console.log("Contract verified successfully");
    } catch (e) {
      console.log("Verification error:", e.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
