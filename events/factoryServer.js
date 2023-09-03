//File name: server.js
const { execSync } = require('child_process');
var Contract = require('web3-eth-contract');
const { factoryAbi } = require('./factoryAbi');


// set provider for all later instances to use
Contract.setProvider('wss://goerli.infura.io/ws/v3/e35f15470b5647fa9e63d19c04b4e474');

var address = '0xfdF7a8659eC4dEA7FfE2f0d36F7A7D901be54185';

var contract = new Contract(factoryAbi, address);

contract.events.Deployed(() => {
}).on("connected", function(subscriptionId){
    console.log('SubID: ',subscriptionId);
})
.on('data', function(event){
    console.log('Event:', event);
    console.log('New Contract Address: ',event.returnValues.contractAddr);
  //Write send email process here!
  execSync(`echo 'Contract created at ${event.returnValues.contractAddr}' | mail -s 'Tambora Event' bryan2j@gmail.com`, { encoding: 'utf-8' });
})
.on('changed', function(event){
    //Do something when it is removed from the database.
})
.on('error', function(error, receipt) {
    console.log('Error:', error, receipt);
});;
