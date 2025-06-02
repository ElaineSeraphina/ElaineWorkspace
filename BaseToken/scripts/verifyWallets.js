const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Supported chains configuration
const chains = [
    {
        name: 'Base Mainnet',
        rpc: 'https://mainnet.base.org',
        explorer: 'https://api.basescan.org/api',
        apiKey: process.env.BASE_API_KEY,
        chainId: 8453
    }
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
        const provider = new ethers.JsonRpcProvider(chain.rpc);
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
