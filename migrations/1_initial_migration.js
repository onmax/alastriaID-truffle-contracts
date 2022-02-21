const Migrations = artifacts.require('contracts/misc/Migrations.sol');

module.exports = function (deployer) {
  deployer.deploy(Migrations, { gas: 0x6691b7, gasPrice: 0x0 });
};
