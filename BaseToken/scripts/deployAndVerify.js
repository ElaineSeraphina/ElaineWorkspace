const hre = require("hardhat");
const axios = require("axios");
require("dotenv").config();

// Nature-themed word parts for token names
const prefixes = ['sea', 'sky', 'eco', 'geo', 'bio', 'air', 'sun', 'moon', 'star', 'leaf'];
const suffixes = ['ia', 'ex', 'on', 'um', 'us', 'ix'];

function generateTokenName() {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = prefix + suffix;
    const symbol = (prefix[0] + suffix.substring(0, Math.min(2, suffix.length))).toUpperCase();
    return { name, symbol };
}

async function verifyContract(address, name, symbol, initialSupply) {
    try {
        await hre.run("verify:verify", {
            address: address,
            constructorArguments: [name, symbol, initialSupply],
        });
        console.log("Contract verified successfully");
        return true;
    } catch (e) {
        console.log("Verification error:", e.message);
        return false;
    }
}

async function checkWalletInteractions(contractAddress) {
    try {
        const response = await axios.get('https://api.basescan.org/api', {
            params: {
                module: 'account',
                action: 'txlist',
                address: contractAddress,
                startblock: 0,
                endblock: 99999999,
                sort: 'asc',
                apikey: process.env.BASE_API_KEY
            }
        });

        if (response.data.status === '1' && response.data.result) {
            const uniqueWallets = new Set();
            response.data.result.forEach(tx => {
                uniqueWallets.add(tx.from.toLowerCase());
            });
            return uniqueWallets.size;
        }
        return 0;
    } catch (error) {
        console.error('Error checking wallet interactions:', error.message);
        return 0;
    }
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    const BaseToken = await hre.ethers.getContractFactory("BaseToken");
    const deployedTokens = [];

    // Deploy tokens
    for (let i = 0; i < 3; i++) { // Deploying 3 tokens as an example
        const { name, symbol } = generateTokenName();
        const initialSupply = 1000000; // 1 million tokens

        console.log(`\nDeploying token #${i + 1}:`);
        console.log(`Name: ${name}`);
        console.log(`Symbol: ${symbol}`);

        try {
            const token = await BaseToken.deploy(name, symbol, initialSupply);
            await token.waitForDeployment();
            const tokenAddress = await token.getAddress();
            console.log(`Token deployed to: ${tokenAddress}`);
            
            // Wait for 30 seconds before verification
            console.log("Waiting for block confirmations...");
            await new Promise(resolve => setTimeout(resolve, 30000));
            
            const verified = await verifyContract(tokenAddress, name, symbol, initialSupply);
            if (verified) {
                deployedTokens.push({
                    name,
                    symbol,
                    address: tokenAddress
                });
            }
        } catch (error) {
            console.error(`Error deploying token ${name}:`, error.message);
        }
    }

    // Check wallet interactions for deployed tokens
    console.log("\nChecking wallet interactions for deployed tokens...");
    for (const token of deployedTokens) {
        const walletCount = await checkWalletInteractions(token.address);
        console.log(`\nToken: ${token.name} (${token.symbol})`);
        console.log(`Address: ${token.address}`);
        console.log(`Unique interacting wallets: ${walletCount}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
