import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import fs from "fs";
import { execSync } from "child_process";
import inquirer from "inquirer";

dotenv.config();

function getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace("T", " ").substring(0, 16); 
}

async function main() {
    console.log(`[${getTimestamp()}] 🚀 Starting Deployment & Verification on Monad Testnet...\n`);

    const answers = await inquirer.prompt([
        { name: "name", message: "Enter Token Name:", type: "input" },
        { name: "symbol", message: "Enter Token Symbol:", type: "input" },
        { name: "supply", message: "Enter Initial Supply (in tokens):", type: "number" },
    ]);

    const { name, symbol, supply } = answers;

    const tokenSupply = ethers.parseUnits(supply.toString(), 0);

    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
    const signer = wallet.connect(provider);

    console.log(`[${getTimestamp()}] 📁 Deploying ${name} (${symbol}) with ${supply} supply`);
    const ERC20 = await ethers.getContractFactory("ERC20Token", signer);
    const token = await ERC20.deploy(name, symbol, tokenSupply);

    await token.waitForDeployment();
    const contractAddress = await token.getAddress();

    console.log(`[${getTimestamp()}] ✅ Successfully deployed ${name} (${symbol}) on Monad Testnet`);
    console.log(`[${getTimestamp()}] ✅ Contract: https://testnet.monadexplorer.com/token/${contractAddress}`);

    const deployResults = {
        network: "monad",
        contractAddress,
        name,
        symbol,
        supply,
        timestamp: getTimestamp(),
    };
    fs.writeFileSync("output.json", JSON.stringify(deployResults, null, 2));

    console.log(`\n[${getTimestamp()}] 🔍 Starting Verification on Sourcify...\n`);

    try {
        const command = `npx hardhat verify --network monad ${contractAddress} "${name}" "${symbol}" ${tokenSupply}`;
        execSync(command, { stdio: "inherit" });

        console.log(`[${getTimestamp()}] ✅ Verified successfully on Monad Testnet!`);
    } catch (error) {
        console.error(`[${getTimestamp()}] ❌ Verification failed on Monad:`, error);
    }

    console.log(`\n[${getTimestamp()}] 🎉 Deployment & Verification Completed on Monad!\n`);
}

main().catch((error) => {
    console.error(`[${getTimestamp()}] ❌ Process failed:`, error);
    process.exit(1);
});
