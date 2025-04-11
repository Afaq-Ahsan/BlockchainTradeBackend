require('dotenv').config();
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Include all relevant functions used in backend
const abi = [
  "function createTrade(address counterParty, address creatorTokenAddress, uint256 creatorTokenIdOrAmount, uint8 creatorTokenType, address counterPartyTokenAddress, uint256 counterPartyTokenIdOrAmount, uint8 counterPartyTokenType) external",
  "function cancelTrade(uint256 tradeId) external",
  "function confirmTrade(uint256 tradeId) external payable"
];

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

module.exports = { contract };
