import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Form, Button, Input, Message, Select, Popup } from 'semantic-ui-react';
import web3 from '../web3';
import factory from '../factory';
import Router from 'next/router';
import Header from '../components/Header';
import InfoMessage from '../components/InfoMessage';
import TamboraFactory from '../artifacts/contracts/TamboraFactory.sol/TamboraFactory.json';
import { create } from 'ipfs-http-client';

const options = [
  { key: 'm', text: 'Musician', value: 'musician' }
];

class CreateContract extends Component {
  state = {
    name: '',
    symbol: '',
    price: '',
    errorMessage: '',
    infoMessage: '',
    loading: false,
    success: false,
    image: '',
    contractType: '',
    auxUri: '',
    uri: '',
    url: '',
    contractAddress: ''
  };

  handleChange = (e, { value }) => this.setState({ contractType: value })

  fileHandler = (event) => {
    event.preventDefault()
    this.setState({ isMp4: false, isPng: false, errorMessage: '', success: false });
    if (event.target.value.endsWith('.png')) {
      console.log('PNG DETECTED');
      this.setState({ url: URL.createObjectURL(event.target.files[0]) });
    } else {
      this.setState({ errorMessage: "Unsupported File at This Time" });
    }
  }

  removeSpecialChars = (name) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    let formattedName = name;
    for (let i = 0; i < name.length; i++) {
      if (specialChars.test(name[i]) === true) {
	formattedName = formattedName.replace(name[i], '');
      }
    }
    return formattedName;
  }

  processName = (name) => {
    const lowercaseName = name.toLowerCase();
    const trimName = lowercaseName.trim();
    const rmSpacesName = trimName.replaceAll(' ', '');
    const rmSpecCharsName = this.removeSpecialChars(rmSpacesName);
    return rmSpecCharsName;
  }

  onSubmit = async (img) => {
    this.setState({ loading: true, errorMessage: '', success: false, infoMessage: 'Adding file to IPFS' });
    await this.ipfsAdd(img);
    this.setState({ infoMessage: 'Interacting with the EVM' });
    try {
      const name = this.processName(this.state.name);
      this.setState({ name: name });
      const factory = await new web3.eth.Contract(TamboraFactory.abi, process.env.FACTORY_ADDRESS);
      const names = await factory.methods.getNames().call();
      for (var i = 0; i < names.length; i++) {
	if (names[i] === this.state.name) {
	  throw { message: 'Name already exists' };
	}
      }
      const accounts = await web3.eth.getAccounts();
      const tx = await factory.methods.deployTambora(this.state.name, this.state.symbol, web3.utils.toWei(this.state.price, 'ether'), this.state.contractType, accounts[0], `ipfs://${this.state.uri}`).send({from: accounts[0]});
      this.setState({ infoMessage: '', success: true, loading: false, contractAddress: tx.events['Deployed'].returnValues.contractAddr });
      async function pusher() {
	const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
	const eventLog = tx.events['Deployed'].returnValues.contractAddr;
	console.log(eventLog);
	Router.push({pathname: '/', query: [eventLog]});
      }
      setTimeout(pusher, 3000);
    } catch (err) {
      this.setState({ errorMessage: err.message, loading: false, infoMessage: '' });
      }
  };

  ipfsAdd = async (file) => {
    const auth = 'Basic ' + Buffer.from(process.env.PROJECT_ID + ':' + process.env.PROJECT_SECRET).toString('base64');

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
	authorization: auth
      }
    })
    try {
      const added = await client.add(file, { progress: prog  => console.log(`Received: ${prog}`)});
      await this.createMeta(added.path);
    } catch (event) {
      console.log(event);
      this.setState({ errorMessage: 'Unable to process file. Only png, mp4, and JSON available at this time.', isLoading: false, infoMessage: '' });
    }
  }

  createMeta = async (cid) => {
    this.setState({ infoMessage: 'Creating metadata' });
    try {
      const metadata = {
	"name": this.state.name,
	"image": `ipfs://${cid}`,
	"description": `Token prime of ${this.state.name} contract`,
	"attributes": [
	  {
	    "trait_type": "role",
	    "value": "owner"
	  },
	  {
	    "trait_type": "token type",
	    "value": "contract membership"
	  },
	  {
	    "trait_type": "aux uri",
	    "value": ""
	  }
	]
      };
      const data = JSON.stringify(metadata);
      await this.ipfsAddJSON(data);
    } catch (error){
      this.setState({ errorMessage: error, isLoading: false, infoMessage: '' });
    }
  }

  ipfsAddJSON = async (file) => {
    this.setState({ infoMessage: 'Adding metadata to IPFS' });
    const auth = 'Basic ' + Buffer.from(process.env.PROJECT_ID + ':' + process.env.PROJECT_SECRET).toString('base64');

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
	authorization: auth
      }
    })
    try {
      const added = await client.add(file, { progress: prog  => console.log(`Received: ${prog}`)});
      this.setState({ uri: added.path });
    } catch (event) {
      console.log(event);
      this.setState({ errorMessage: 'Unable to process file. Only png, mp4, and JSON available at this time.', isLoading: false, infoMessage: '' });
    }
  }

  mintNFT = async (cid) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      const tx = await contract.methods.mint(accounts[0], `ipfs://${cid}`).send({from: accounts[0]});
      this.setState({ success: true });
      // const pusher = async () => {
      // 	console.log('Minted successfully at: ', tx.transactionHash)
      // 	Router.push({pathname: '/', query: [tx.transactionHash]});
      // }
      // setTimeout(pusher, 3000);
      console.log('Minted successfully at: ', tx.transactionHash);
      this.setState({ isLoading: false, success: true });
    } catch (error){
      this.setState({ errorMessage: error, infoMessage: '' })
    }
  }

  render() {
    return (
      <Layout>
	<Header />
        <h3>Create your own ERC721 contract.</h3>
        <Form onSubmit={ event => {this.onSubmit(document.getElementById("image-picker").files[0])}} error={!!this.state.errorMessage} success={this.state.success}>
	  <Form.Group widths='equal'>
	    <Form.Field>
	      <Popup
		trigger={<label>Name</label>}
		content='Enter a name for your contract. Use only lowercase letters.'
		position='top left'
              />
	      <Input
		value={this.state.name}
		onChange={event => this.setState({ name: event.target.value })}
		placeholder='myawesomecontract'
	      />
	    </Form.Field>
	    <Form.Field>
	      <Popup
		trigger={<label>Symbol</label>}
		content='Symbols are all in caps and 3-4 characters long'
		position='top left'
              />
	      <Input
		value={this.state.symbol}
		onChange={event => this.setState({ symbol: event.target.value })}
		placeholder='MACT'
	      />
	    </Form.Field>
	    <Form.Field>
	      <Popup
		trigger={<label>Price</label>}
		content='Enter the amount, in ether, you would like to charge your clients. For the amount specified, clients will be given approval to mint 5 NFT tokens from your contract.'
		position='top left'
              />
	      <Input
		label='Ether'
		labelPosition='right'
		value={this.state.price}
		onChange={event => this.setState({ price: event.target.value })}
		placeholder="0.08"
	      />
	    </Form.Field>
	    <Popup
	      trigger={
		<Form.Field
		  control={Select}
		  label='Type'
		  options={options}
		  placeholder='Type'
		  onChange={this.handleChange}
		/>
	      }
	      content='We are working hard to expand this list to meet the needs of society'
	      position='top left'
	    />
	  </Form.Group>
	  <Form.Field>
	    <Popup
	      trigger={<label>Image</label>}
	      position='top left'
	      content="Choose a .png file to represent your contract. Each of your clients will be minted a token containing this image."
	    />
   	    <Input
   	      id="image-picker"
   	      type="file"
   	      onChange={() => this.fileHandler(event)}
   	    />
   	  </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
	  <Message
	    success
	    header='Success!'
	    content={`Contract Created at ${this.state.contractAddress}`}
	  />
	  <InfoMessage
	    isShowing={!!this.state.infoMessage}
	    header='Please Wait...'
	    content={this.state.infoMessage}
	  />
	  <Popup
	    trigger={<Button type='submit' loading={this.state.loading} color='olive'>Create</Button>}
	    location='top left'
	    content="Clicking on 'Create' will mint you the 'token prime' and mark you as the owner of the contract. As the owner, you will be authorized to approve up to 200 token mintings. At that point you may choose to extend the contract's mint allowance."
	  />
        </Form>
      </Layout>
    );
  };
};

export default CreateContract;
