import { Form, Input, Button, Message } from 'semantic-ui-react'
import web3 from '../web3'
import { factoryContract, address } from '../pages/index'
import { factoryAbi } from '../abi'

export default function CreateForm() {
  const state = {
    errorMessage: '',
    loading: false,
    name: '',
    symbol: '',
    price: 0
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    
    const contract = web3.eth.Contract(factoryAbi, address);
    state.loading = true;
    state.errorMessage = '';

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.deployTambora(state.name, state.symbol, state.price).send({
	from: accounts[0],
	value: web3.utils.toWei(0.033, 'ether')
      });
    } catch (err) {
      state.errorMessage = err.message
    }
    state.loading = false;
  }
  
  return (
    <Form success error={!!state.errorMessage}>
      <Form.Group>
	<Form.Field
	  id='form-contract-name'
	  control={Input}
	  label='Contract Name'
	  placeholder='MyGreatSchool'
	  error={{
	    content: 'Enter a name for your contract',
	    pointing: 'below'
	  }}
	  value={state.name}
	  onChange={event => state.name = event.target.value }
	/>
	<Form.Field
	  id='form-contract-symbol'
	  control={Input}
	  label='Contract Symbol'
	  placeholder='MGSC'
	  error={{
	    content: 'Enter a symbol for your contract',
	    pointing: 'below'
	  }}
	  value={state.symbol}
	  onChange={event => state.symbol = event.target.value}
	/>
	<Form.Field
	  id='form-nft-price'
	  control={Input}
	  label='NFT Price'
	  placeholder='0.08'
	  error={{
	    content: 'Enter a price for your NFTs',
	    pointing: 'below'
	  }}
	  value={state.price}
	  onChange={event => state.price = event.target.value}
	/>	
	<Form.Field
	  id='form-submit-button'
	  control={Button}
	  content='Create'
	/>
	<Message
	  success
	  header='Success!'
	  content='Contract Created'
	/>
	<Message
	  error
	  header='Error!'
	  content={state.errorMessage}
	/>	
      </Form.Group>
    </Form>
    
  );
}
