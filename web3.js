import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running
  try {
  web3 = new Web3(window.ethereum);
  // window.ethereum.enable();
    window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch(error) {
    console.log(error);
  }
} else {
    // We are on the server or user not running metamask
    const provider = new Web3.providers.HttpProvider(process.env.INFURA_NODE_GOERLI);
    web3 = new Web3(provider);
}

export default web3;
