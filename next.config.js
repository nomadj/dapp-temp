const localEnv = require('./.env');

module.exports = {
  reactStrictMode: true,
  env: {
    INFURA_NODE: localEnv.infuraNode,
    INFURA_NODE_GOERLI: localEnv.infuraNodeGoerli,
    PROJECT_ID: localEnv.projectId,
    PROJECT_SECRET: localEnv.projectSecret
  }
}
