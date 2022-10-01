import web3 from './web3';
import { factoryAbi } from './abi';

const address = '0x7B516015eA579dFa978Db3C3B75e677165a6E8C6'; // goerli  
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

