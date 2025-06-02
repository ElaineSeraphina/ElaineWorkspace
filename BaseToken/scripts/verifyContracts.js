const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Supported chains configuration
const chains = [
    {
        name: 'Ethereum Mainnet',
        rpc: 'https://eth-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_KEY,
        explorer: 'https://api.etherscan.io/api',
        apiKey: process.env.ETHERSCAN_API_KEY,
        chainId: 1
    },
    {
        name: 'BSC Mainnet',
        rpc: 'https://bsc-dataseed.binance.org',
        explorer: 'https://api.bscscan.com/api',
        apiKey: process.env.BSCSCAN_API_KEY,
        chainId: 56
    },
    {
        name: 'Polygon Mainnet',
        rpc: 'https://polygon-rpc.com',
        explorer: 'https://api.polygonscan.com/api',
        apiKey: process.env.POLYGONSCAN_API_KEY,
        chainId: 137
    },
    {
        name: 'Avalanche C-Chain',
        rpc: 'https://api.avax.network/ext/bc/C/rpc',
        explorer: 'https://api.snowtrace.io/api',
        apiKey: process.env.SNOWTRACE_API_KEY,
        chainId: 43114
    },
    // Add more chains as needed
];

async function getContractTransactions(contractAddress, chain) {
    try {
        const response = await axios.get(chain.explorer, {
            params: {
                module: 'account',
                action: 'txlist',
                address: contractAddress,
                startblock: 0,
                endblock: 99999999,
                sort: 'asc',
                apikey: chain.apiKey
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
        console.error(`Error fetching transactions for ${contractAddress} on ${chain.name}:`, error.message);
        return 0;
    }
}

async function getVerifiedContracts(chain) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(chain.rpc);
        const latestBlock = await provider.getBlockNumber();
        
        console.log(`\nAnalyzing ${chain.name}...`);
        console.log(`Latest block: ${latestBlock}`);

        // Get verified contracts from explorer
        const response = await axios.get(chain.explorer, {
            params: {
                module: 'contract',
                action: 'listverifiedcontracts',
                page: 1,
                offset: 100,
                apikey: chain.apiKey
            }
        });

        if (response.data.status === '1' && response.data.result) {
            let contractsWithActivity = 0;
            
            for (const contract of response.data.result) {
                const uniqueWallets = await getContractTransactions(contract.ContractAddress, chain);
                
                if (uniqueWallets >= 10) {
                    contractsWithActivity++;
                    console.log(`\nContract: ${contract.ContractName}`);
                    console.log(`Address: ${contract.ContractAddress}`);
                    console.log(`Unique wallets: ${uniqueWallets}`);
                    console.log(`Compiler version: ${contract.CompilerVersion}`);
                }
            }

            console.log(`\nTotal contracts with 10+ unique wallets on ${chain.name}: ${contractsWithActivity}`);
            return contractsWithActivity;
        }
        return 0;
    } catch (error) {
        console.error(`Error analyzing ${chain.name}:`, error.message);
        return 0;
    }
}

async function main() {
    console.log('Starting contract verification analysis...');
    
    let totalContracts = 0;
    for (const chain of chains) {
        const count = await getVerifiedContracts(chain);
        totalContracts += count;
    }
    
    console.log(`\nTotal contracts across all chains with 10+ unique wallets: ${totalContracts}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
