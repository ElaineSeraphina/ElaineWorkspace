const { ethers } = require("ethers");
const fs = require("fs");
const readline = require("readline");
const chalk = require("chalk"); // Tidak perlu .default untuk chalk versi 4.1.2

const PRIVATE_KEY_FILE = "privatekey.txt";
const ADDRESS_FILE = "address.txt";
const TOKEN_FILE = "token.txt";
const RPC_URL = "https://testnet-rpc.monad.xyz/";
const BLOCK_EXPLORER_URL = "https://testnet.monadexplorer.com/tx/0x/";
const CHAIN_ID = 10143;
const DEFAULT_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8").trim();
  } catch (error) {
    console.warn(
      chalk.yellow(`[⚠️] File ${filePath} not found or unreadable. Using default.`)
    );
    return "";
  }
}

function validateAddresses(addresses) {
  return addresses.filter((address) => {
    if (!ethers.isAddress(address.trim())) {
      console.warn(chalk.yellow(`[⚠️] Invalid address skipped: ${address}`));
      return false;
    }
    return true;
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendToRecipient(
  tokenContract,
  recipientAddress,
  amountInWei,
  isNativeToken
) {
  try {
    console.log(
      chalk.blue(
        `[🚀] Sending ${isNativeToken ? "TEA" : "tokens"} to ${recipientAddress}...`
      )
    );
    let tx;
    if (isNativeToken) {
      tx = await tokenContract.sendTransaction({
        to: recipientAddress.trim(),
        value: amountInWei,
      });
    } else {
      tx = await tokenContract.transfer(recipientAddress.trim(), amountInWei);
    }
    console.log(chalk.green(`[✅] Transaction sent! Hash: ${tx.hash}`));
    console.log(
      chalk.cyan(`[🔗] View on Block Explorer: ${BLOCK_EXPLORER_URL}${tx.hash}`)
    );
  } catch (error) {
    console.error(
      chalk.red(`[❌] Error sending to ${recipientAddress}: ${error.message}`)
    );
  }
}

async function sendToken(amountToSend) {
  let privateKey, recipientAddresses;

  try {
    privateKey = readFileContent(PRIVATE_KEY_FILE);
    recipientAddresses = readFileContent(ADDRESS_FILE).split("\n");
  } catch (error) {
    console.error(chalk.red("[❌] Failed to read input files. Exiting..."));
    return;
  }

  if (!RPC_URL || !privateKey) {
    console.error(
      chalk.red("[❌] Missing required parameters: RPC URL or private key.")
    );
    return;
  }

  let tokenContractAddress = readFileContent(TOKEN_FILE);
  let isNativeToken = false;

  if (!tokenContractAddress || !ethers.isAddress(tokenContractAddress)) {
    console.warn(
      chalk.yellow(
        "[⚠️] Invalid or missing token address. Using native token (TEA)."
      )
    );
    tokenContractAddress = DEFAULT_TOKEN_ADDRESS;
    isNativeToken = true;
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
  const wallet = new ethers.Wallet(privateKey, provider);
  const erc20Abi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() public view returns (uint8)",
  ];
  const tokenContract = isNativeToken
    ? wallet
    : new ethers.Contract(tokenContractAddress, erc20Abi, wallet);

  let amountInWei;
  try {
    if (isNativeToken) {
      amountInWei = ethers.parseUnits(amountToSend, 18);
    } else {
      const decimals = await tokenContract.decimals();
      amountInWei = ethers.parseUnits(amountToSend, decimals);
    }
  } catch (error) {
    console.error(
      chalk.red(`[❌] Error fetching token decimals: ${error.message}`)
    );
    return;
  }

  recipientAddresses = validateAddresses(recipientAddresses);
  if (recipientAddresses.length === 0) {
    console.error(chalk.red("[❌] No valid recipient addresses found."));
    return;
  }

  for (const recipientAddress of recipientAddresses) {
    await sendToRecipient(
      tokenContract,
      recipientAddress,
      amountInWei,
      isNativeToken
    );
    await delay(5000);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  chalk.magenta("[💰] Enter the amount of tokens to send: "),
  (amountToSend) => {
    if (!amountToSend || isNaN(amountToSend) || Number(amountToSend) <= 0) {
      console.error(chalk.red("[❌] Invalid amount entered. Exiting..."));
      rl.close();
      return;
    }

    sendToken(amountToSend).then(() => rl.close());
  }
);
