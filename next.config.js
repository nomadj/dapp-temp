const localEnv = require('./.env');

module.exports = {
  reactStrictMode: true,
  env: {
    INFURA_NODE: localEnv.infuraNode,
    INFURA_NODE_GOERLI: localEnv.infuraNodeGoerli
  }
}
