require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-truffle5");
const dotenv = require('dotenv');
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const secretkey = process.env.SECRETKEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.13",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/75e8246ec7ee46d2b45b03578fa9598a",
      accounts: [secretkey]
    },
    goerli: {
      url: "https://goerli.infura.io/v3/75e8246ec7ee46d2b45b03578fa9598a",
      accounts: [secretkey]
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/75e8246ec7ee46d2b45b03578fa9598a",
      accounts: [secretkey]
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "N1AJCD1DWSGX3EWBYP4KYBPD9J15GGEACH"
  },
  mocha: {
    timeout: 70000
  }
};