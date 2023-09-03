//File name: server.js
const { execSync } = require('child_process');
var Contract = require('web3-eth-contract');
const { abi } = require('./abi');


// set provider for all later instances to use
Contract.setProvider('wss://goerli.infura.io/ws/v3/e35f15470b5647fa9e63d19c04b4e474');

var address = '0x77c2b2cDE0c99d6671C005f4c1f12790D5172eBE';

var contract = new Contract(abi, address);

contract.events.FileAdded(() => {
}).on("connected", function(subscriptionId){
    console.log('SubID: ',subscriptionId);
})
.on('data', function(event){
    console.log('Event:', event);
    console.log('File Added: ', event.returnValues.name);
  //Write send email process here!
  execSync(`echo 'File added named ${event.returnValues.name}' | mail -s 'Tambora Event' bryan2j@gmail.com`, { encoding: 'utf-8' });
})
.on('changed', function(event){
    //Do something when it is removed from the database.
})
.on('error', function(error, receipt) {
    console.log('Error:', error, receipt);
});
