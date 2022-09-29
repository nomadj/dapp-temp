const localEnv = require('./.env');

console.log(localEnv.infuraNode, localEnv.infuraNodeGoerli);

module.exports = {
  reactStrictMode: true,
  env: {
    INFURA_NODE: localEnv.infuraNode,
    INFURA_NODE_GOERLI: localEnv.infuraNodeGoerli
  }
}
