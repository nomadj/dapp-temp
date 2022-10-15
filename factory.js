import web3 from './web3';
import { factoryAbi } from './abi';

const address = '0x9E01e0A1a5f8472E64D0d5f0EbC6f7d21D7b4056'; // goerli  
const instance =  new web3.eth.Contract(factoryAbi, address);

// EVENT LISTENER
// instance.events.Deployed(() => {
// }).on('connected', function(subscriptionId){
//   console.log('SubID: ', subscriptionId);
// })
//   .on('data', function(event){
//     console.log('Event:', event);
//     console.log('New Contract Address: ', event.returnValues.contractAddr);
//     //Write send email process here!
//   })
//   .on('changed', function(event){
//     //Do something when it is removed from the database.
//   })
//   .on('error', function(error, receipt) {
//     console.log('Error:', error, receipt);
//   });;

export default instance;

