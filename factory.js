import web3 from './web3';
import { factoryAbi } from './abi';

const address = '0x56D171F2752252CdB0Fe96C24dDCAe404253C7c8'; // goerli  
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

