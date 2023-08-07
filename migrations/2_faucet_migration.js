// const artifacts = require('truffle-artifactor').default;

const Faucet = artifacts.require('Faucet');

module.exports = function (deployer) {
  deployer.deploy(Faucet);
};
