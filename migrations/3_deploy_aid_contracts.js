const fs = require('fs');
const TruffleConfig = require('@truffle/config');

const Eidas = artifacts.require('contracts/libs/Eidas.sol');
const AlastriaIdentityServiceProvider = artifacts.require(
  'contracts/identityManager/AlastriaIdentityServiceProvider.sol'
);
const AlastriaIdentityIssuer = artifacts.require(
  'contracts/identityManager/AlastriaIdentityIssuer.sol'
);
const Proxy = artifacts.require(
  './contracts/openzeppelin/upgradeability/AdminUpgradeabilityProxy.sol'
);
const AlastriaIdentityManager = artifacts.require(
  'contracts/identityManager/AlastriaIdentityManager.sol'
);
const AlastriaCredentialRegistry = artifacts.require(
  'contracts/registry/AlastriaCredentialRegistry.sol'
);
const AlastriaPresentationRegistry = artifacts.require(
  'contracts/registry/AlastriaPresentationRegistry.sol'
);
const AlastriaPublicKeyRegistry = artifacts.require(
  'contracts/registry/AlastriaPublicKeyRegistry.sol'
);

const addresses = {};

async function saveAddresesInfo(address, contractName, network) {
  if (network === 'development') {
    return;
  }
  addresses[contractName] = address;
  console.log(`${contractName} address info saved!`);
}

module.exports = async function (deployer, network, accounts) {
  const config = TruffleConfig.detect().env;

  const eidas = await Eidas.deployed();
  await saveAddresesInfo(eidas.address, config.eidas, network);

  await deployer.link(Eidas, AlastriaIdentityIssuer);
  await deployer.link(Eidas, AlastriaIdentityManager);

  const serviceProvider = await AlastriaIdentityServiceProvider.new({ gas: 0x6691b7, gasPrice: 0x0 });
  console.log('serviceProvider deployed: ', serviceProvider.address);
  await saveAddresesInfo(
    serviceProvider.address,
    config.serviceProvider,
    network
  );

  const identityIssuer = await AlastriaIdentityIssuer.new({ gas: 0x6691b7, gasPrice: 0x0 });
  console.log('identityIssuer deployed: ', identityIssuer.address);
  await saveAddresesInfo(
    identityIssuer.address,
    config.identityIssuer,
    network
  );

  const credentialRegistry = await AlastriaCredentialRegistry.new({ gas: 0x6691b7, gasPrice: 0x0 });
  const proxyCredentialRegistry = await Proxy.new(
    credentialRegistry.address,
    config.adminAccount,
    [],
    { gas: 0x6691b7, gasPrice: 0x0 }
  );
  console.log('credentialRegistry deployed: ', proxyCredentialRegistry.address);
  await saveAddresesInfo(
    proxyCredentialRegistry.address,
    config.credential,
    network
  );

  const presentationRegistry = await AlastriaPresentationRegistry.new({ gas: 0x6691b7, gasPrice: 0x0 });
  const proxyPresentationRegistry = await Proxy.new(
    presentationRegistry.address,
    config.adminAccount,
    [],
    { gas: 0x6691b7, gasPrice: 0x0 }
  );
  console.log(
    'presentationRegistry deployed: ',
    proxyPresentationRegistry.address
  );
  await saveAddresesInfo(
    proxyPresentationRegistry.address,
    config.presentation,
    network
  );

  const publicKeyRegistry = await AlastriaPublicKeyRegistry.new({ gas: 0x6691b7, gasPrice: 0x0 });
  const proxyPublicKeyRegistry = await Proxy.new(
    publicKeyRegistry.address,
    config.adminAccount,
    [],
    { gas: 0x6691b7, gasPrice: 0x0 }
  );
  console.log('publicKeyRegistry deployed: ', proxyPublicKeyRegistry.address);
  await saveAddresesInfo(
    proxyPublicKeyRegistry.address,
    config.publicKey,
    network
  );

  const identityManager = await AlastriaIdentityManager.new({ gas: 0x6691b7, gasPrice: 0x0 });
  const proxyIdentityManager = await Proxy.new(
    identityManager.address,
    config.adminAccount,
    [],
    { gas: 0x6691b7, gasPrice: 0x0 }
  );
  console.log('identityManager deployed: ', proxyIdentityManager.address);
  await saveAddresesInfo(
    proxyIdentityManager.address,
    config.manager,
    network
  );

  await fs.writeFileSync('./addresses.json', JSON.stringify(addresses));
};
