const Eidas = artifacts.require('contracts/libs/Eidas.sol');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Eidas, { gas: 0x6691b7, gasPrice: 0x0 });
};
