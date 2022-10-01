var Web3 = require('web3');

var web3 = new Web3('wss://goerli.infura.io/ws/v3/7f709d402b7e4ec59b7c771c3da42204');

var contract_address = '0x7B516015eA579dFa978Db3C3B75e677165a6E8C6';
var event_hash = web3.utils.sha3('Deployed(address)');
console.log('Event Hash:', event_hash);
var subscription = web3.eth.subscribe('logs',{ address: contract_address, topics: [event_hash]},(error, event) => {
    //Do something
}).on("connected", function(subscriptionId){
    console.log('SubID: ',subscriptionId);
})
.on('data', function(event){
    console.log('Event:', event); 
  console.log(event.topics[1].replace('000000000000000000000000', ''));
    //Write send mail here!
})
.on('changed', function(event){
    // remove event from local database
})
.on('error', function(error, receipt) { 
    console.log('Error:', error, receipt);
});;
