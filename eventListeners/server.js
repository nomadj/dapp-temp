//File name: server.js
const { execSync } = require('child_process');

var Contract = require('web3-eth-contract');
// var { factoryAbi } = require('../dapp-temp/abi');

const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contractTambora","name":"contractAddr","type":"address"}],"name":"Deployed","type":"event"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"price_","type":"uint256"}],"name":"deployTambora","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getDeployedContracts","outputs":[{"internalType":"contractTambora[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNames","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractOwner","type":"address"}],"name":"getOwnedContracts","outputs":[{"internalType":"contractTambora[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"names","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]

// set provider for all later instances to use
Contract.setProvider('wss://goerli.infura.io/ws/v3/7f709d402b7e4ec59b7c771c3da42204');

var address = '0x7B516015eA579dFa978Db3C3B75e677165a6E8C6';

var contract = new Contract(abi, address);

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
