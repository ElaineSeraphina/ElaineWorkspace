# Base Token Project

A smart contract project for deploying ERC20 tokens on Base Network (L2).

## Features

- ERC20 Token deployment on Base Network
- Automated token name generation with nature-themed names
- Contract verification on BaseScan
- Gas-optimized using Solidity 0.8.20
- Uses OpenZeppelin contracts for security

## Deployed Token

- Name: moonon
- Symbol: MON
- Supply: 1,000,000 tokens
- Contract: [0xfFd573a9205b5464Ca7a9fC071690821b209e4eb](https://basescan.org/address/0xfFd573a9205b5464Ca7a9fC071690821b209e4eb)

## Requirements

- Node.js 14+
- Hardhat
- Base RPC URL
- BaseScan API Key

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with:
```
PRIVATE_KEY=your_private_key
BASE_API_KEY=your_basescan_api_key
```

## Usage

To deploy a new token:
```bash
npx hardhat run scripts/deploy-base.js --network base
```

## License

MIT
