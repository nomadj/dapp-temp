import json
from web3 import Web3

web3 = Web3(Web3.HTTPProvider("https://polygon-mainnet.infura.io/v3/e35f15470b5647fa9e63d19c04b4e474"))

with open('artifacts/contracts/Tambora.sol/Tambora.json', 'r') as f:
    metaByte = json.load(f)
abi = metaByte["abi"]

trent = "0x591F21D30d02739415526f90184F07ed34EeB258"
contractAddress = "0x00d2743935d5a31749A24B802a173004aA8A7b62"

contract = web3.eth.contract(address=contractAddress, abi=abi)
tokenBalance = contract.functions.balanceOf(trent).call()
tokenId = contract.functions.tokenOfOwnerByIndex(trent, 0).call()
print("Trent owns token #", tokenId)



