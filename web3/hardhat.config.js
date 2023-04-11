/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// console.log(process.env.PRIVATE_KEY);
module.exports = {
  
  solidity: "0.8.17",

  paths: {
    artifacts: "../client/artifacts",
  },

  defaultNetwork: "ganache",
  
  networks: {
    ganache: {
      url: process.env.PROVIDER_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
};
