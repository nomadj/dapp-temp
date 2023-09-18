import Web3 from 'web3';

let web3;

try {
  if (window.ethereum) {
    handleEthereum();
  } else {
    window.addEventListener('ethereum#initialized', handleEthereum, {
      once: true
    });
    setTimeout(handleEthereum, 3000);  
  }
} catch (error) {
  // const provider = new Web3.providers.HttpProvider(process.env.INFURA_NODE_GOERLI);
  const provider = new Web3.providers.HttpProvider(process.env.INFURA_NODE_POLYGON);
  web3 = new Web3(provider);
}

function handleEthereum() {
  const { ethereum } = window;
  if (ethereum && ethereum.isMetaMask) {
      // We are in the browser and metamask is running
    web3 = new Web3(window.ethereum);
  // window.ethereum.enable();
    window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
    // const provider = new Web3.providers.HttpProvider(process.env.INFURA_NODE_GOERLI);
    const provider = new Web3.providers.HttpProvider(process.env.INFURA_NODE_MUMBAI);
    web3 = new Web3(provider);
  }
}

// if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
//   // We are in the browser and metamask is running
//   web3 = new Web3(window.ethereum);
//   // window.ethereum.enable();
//   window.ethereum.request({ method: 'eth_requestAccounts' });
// } else {
//     // We are on the server or user not running metamask
//   const provider = new Web3.providers.HttpProvider(process.env.INFURA_NODE_GOERLI);
//   web3 = new Web3(provider);
// }

export default web3;
