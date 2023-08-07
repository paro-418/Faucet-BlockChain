// const artifacts = require('truffle-artifactor').default;

const Migrations = artifacts.require('Migrations');

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
