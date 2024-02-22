import 'dotenv/config';
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
const {
  ETHERSCAN_API_KEY,
  DEFAULT_SIGNER_PRIVATE_KEY,
  NETWORK_SEPOLIA_JSON_RPC_URL,
  LOCALHOST_RPC_URL,
  NETWORK_MUMBAI_JSON_RPC_URL,
  SIGNER_1_PRIVATE_KEY,
  POLYGONSCAN_API_KEY
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    enabled: true,
  },
  networks: {
    localhost: {
      url: `${LOCALHOST_RPC_URL}`,
      chainId: 31337,
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      ]
    },
    arbsep: {
      url: 'https://sepolia-rollup.arbitrum.io/rpc',
      chainId: 421614,
      accounts: [`${DEFAULT_SIGNER_PRIVATE_KEY}`],
    },
    hardhat: {
      accounts: {
        accountsBalance: '100000000000000000000'
      }
    },
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  etherscan: {
    apiKey: `${ETHERSCAN_API_KEY}`,
    customChains: [
      {
        network: "arbitrum-sepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
    ],
  }
};

export default config;
