import web3 from './web3';
import Tambora from './artifacts/contracts/Tambora.sol/Tambora.json'

export default (address) => {
  return new web3.eth.Contract(
    Tambora.abi,
    address
  );
};
