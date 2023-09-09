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
import ImageResize from 'image-resize';
import { floatsOnly } from '../utils';
import NoMetamask from '../components/NoMetamask';

const options = [
  { key: 'm', text: 'Musician', value: 'musician' },
  { key: 'c', text: 'Custom', value: 'custom' },
  { key: 'd', text: 'Data Storage', value: 'data' },
  { key: 'g', text: 'Gaming', value: 'gaming' }
];

export async function getServerSideProps() {
  const factoryAddress = process.env.FACTORY_ADDRESS;
  const projectSecret = process.env.PROJECT_SECRET;
  const projectId = process.env.PROJECT_ID;
  return {
    props: {
      factoryAddress,
      projectSecret,
      projectId
    }
  }
}

class CreateContract extends Component {
 constructor(props) {
    super(props);
    this.myRef = React.createRef();
 }
  
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
    contractAddress: '',
    animUrl: '',
    auxUrl: '',
    unsupported: false
  };

  handleChange = (e, { value }) => this.setState({ contractType: value });
  handleExtFileChange = (event) => {
    this.setState({ errorMessage: '', infoMessage: '', success: false });
    try {
      const { type, name } = event.target.files[0];
      //      if (type.slice(type[0], type.indexOf('/')) === 'application' || type.slice(type[0], type.indexOf('/')) === 'text') {
      if (name.endsWith('.glb') || name.endsWith('.gltf') || name.endsWith('.webm') || name.endsWith('.mp4') || name.endsWith('m4v') || name.endsWith('.ogv') || name.endsWith('.ogg') || name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.oga')) {
	this.setState({ animUrl: URL.createObjectURL(event.target.files[0]) });
      } else if (name.endsWith('.pdf') || name.endsWith('.py') || name.endsWith('.json') || name.endsWith('.js')) {
	this.setState({ auxUrl: URL.createObjectURL(event.target.files[0]) });
      } else {
	this.setState({ errorMessage: 'File type unsupported. Choose a different file.' });
      }
    } catch (error) {
      console.log("No file selected");
    }
  }

  fileHandler = (event) => {
    event.preventDefault()
    try {
      const { name, type } = event.target.files[0];
    this.setState({ isMp4: false, isPng: false, errorMessage: '', success: false });
      if (type === 'image/png' || type === 'image/jpeg' || name.startsWith('IMG')) {
      this.setState({ url: URL.createObjectURL(event.target.files[0]) });
    } else {
      throw { message: "Image file types only." };
    }
    } catch (error) {
      this.setState({ errorMessage: error.message });
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
    const trimName = name.trim();
    var rmSpacesName = trimName.replaceAll(' ', '');
    if (rmSpacesName.length > 17) {
      rmSpacesName = rmSpacesName.replace(rmSpacesName[17], '');
    }
    const rmSpecCharsName = this.removeSpecialChars(rmSpacesName);
    return rmSpecCharsName;
  }

  processSymbol = (sym) => {
    const trimSym = sym.trim();
    var rmSpacesSym = trimSym.replaceAll(' ', '');
    if (rmSpacesSym.length > 4) {
      rmSpacesSym = rmSpacesSym.replace(rmSpacesSym[4], '');
    }
    const upperSym = rmSpacesSym.toUpperCase();
    const rmSpecCharsSym = this.removeSpecialChars(upperSym);
    return rmSpecCharsSym;    
  }

  onSubmit = async (img) => {
    const { name, symbol, contractType} = this.state;
    if (this.state.price === '') {
      this.setState({ price: '0'});
    }
    if (this.state.auxUrl !== '' || this.state.animUrl !== '') {      
      await this.ipfsAddExt(document.getElementById("file-picker").files[0]);
    }
    try {
      if (img.type !== 'image/png' && img.type !== 'image/jpeg' && !img.name.startsWith('IMG')) {
	throw { message: 'Choose a different file. Only png and jpg format supported at this time.' };
      } else if (name === '' || symbol === '' || contractType === '') {
	throw { message: 'Please fill out all required fields.' };
      } else if (!window.ethereum) {
	setTimeout(() => {
	  this.setState({ unsupported: true });
	}, 3000);
	throw { message: 'Metamask not detected.'};
      }
	this.setState({ loading: true, errorMessage: '', success: false, infoMessage: 'Adding file to IPFS' });
      // const imageResize = await new ImageResize({
      // 	format: 'png',
      // 	height: '160'
      // });
      // const newImage = await imageResize.play(img.target.files[0]);
      await this.ipfsAdd(img);
      this.setState({ infoMessage: 'Creating new contract' });
      const factory = await new web3.eth.Contract(TamboraFactory.abi, this.props.factoryAddress);
      const names = await factory.methods.getNames().call();
      const mintFee = await factory.methods.mintFee().call();
      const contractFee = await factory.methods.contractFee().call();
      for (var i = 0; i < names.length; i++) {
	if (names[i] === this.state.name) {
	  throw { message: 'Name already exists' };
	}
      }
      const accounts = await web3.eth.getAccounts();
      try {
	const balance = await web3.eth.getBalance(accounts[0]);
	const bal = web3.utils.fromWei(balance, 'ether');
	if (parseFloat(bal) < web3.utils.fromWei(contractFee, 'ether')) {
          throw { message: `Insufficient funds. ${web3.utils.fromWei(contractFee, 'ether')} ETH required.` };
	}
      } catch (error) {
	throw { message: error.message };
      }
      const tx = await factory.methods.deployTambora(this.state.name, this.state.symbol, web3.utils.toWei(this.state.price, 'ether'), this.state.contractType, accounts[0], `ipfs://${this.state.uri}`, mintFee, contractFee).send({from: accounts[0], value: contractFee });
      this.setState({ infoMessage: '', success: true, loading: false, contractAddress: tx.events['Deployed'].returnValues.contractAddr });
      async function pusher() {
	const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
	const eventLog = tx.events['Deployed'].returnValues.contractAddr;
	Router.push({pathname: '/', query: [eventLog]});
      }
      setTimeout(pusher, 3000);      
    } catch (error) {
      this.setState({ infoMessage: '', errorMessage: error.message, loading: false });
    }

    // try {

    // } catch (err) {
    //   this.setState({ errorMessage: err.message, loading: false, infoMessage: '' });
    //   }
  };

  ipfsAdd = async (file) => {
    const auth = 'Basic ' + Buffer.from(this.props.projectId + ':' + this.props.projectSecret).toString('base64');

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
	authorization: auth
      }
    })
    try {
      const added = await client.add(file);
      await this.createMeta(added.path);
    } catch (error) {
      this.setState({ errorMessage: error.message, isLoading: false, infoMessage: '' });
    }
  }

  ipfsAddExt = async (file) => {
    this.setState({ infoMessage: 'Adding aux file to IPFS.' });
    const auth = 'Basic ' + Buffer.from(this.props.projectId + ':' + this.props.projectSecret).toString('base64');

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
	authorization: auth
      }
    })
    try {
      const added = await client.add(file);
      this.setState({ auxUri: `ipfs://${added.path}` });
    } catch (error) {
      this.setState({ errorMessage: error.message, isLoading: false, infoMessage: '' });
    }
  }  


  createMeta = async (cid) => {
    this.setState({ infoMessage: 'Creating metadata' });
    try {
      const metadata = {
	"name": this.state.name,
	"image": `ipfs://${cid}`,
	"description": `Token prime of ${this.state.name} contract`,
	"aux_uri": this.state.auxUrl !== '' ? this.state.auxUri : '',
	"animation_url": this.state.animUrl !== '' ? this.state.auxUri : '',
	"attributes": [
	  {
	    "trait_type": "Role",
	    "value": "Minter"
	  },	  
	  {
	    "trait_type": "Role",
	    "value": "Contract Owner"
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
    const auth = 'Basic ' + Buffer.from(this.props.projectId + ':' + this.props.projectSecret).toString('base64');

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
	authorization: auth
      }
    })
    try {
      const added = await client.add(file);
      this.setState({ uri: added.path });
    } catch (error) {
      this.setState({ errorMessage: error.message, isLoading: false, infoMessage: '' });
    }
  }

  // mintNFT = async (cid) => {
  //   try {
  //     const accounts = await web3.eth.getAccounts();
  //     const contract = new web3.eth.Contract(TamboraFactory.abi, this.props.address);
  //     const tx = await contract.methods.deployTambora(accounts[0], `ipfs://${cid}`).send({from: accounts[0]});
  //     this.setState({ success: true });
  //     this.setState({ isLoading: false, success: true });
  //   } catch (error){
  //     this.setState({ errorMessage: error, infoMessage: '' })
  //   }
  // }

  render() {
    if (this.state.unsupported) {
      return (
	<Layout>
	  <NoMetamask />
	</Layout>
      );
    } else {
      return (
	<Layout ref={this.myRef}>
	  <h3>Create a new NFT contract</h3>
	  <Form onSubmit={ event => {this.onSubmit(document.getElementById("image-picker").files[0])}} error={!!this.state.errorMessage} success={this.state.success}>
	    <Form.Group widths='equal'>
	      <Form.Field required>
		<label>Name</label>		
		<Input
		  value={this.state.name}
		  onChange={event => this.setState({ name: this.processName(event.target.value) })}
		  placeholder='BrokeApeClubHouse'
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Symbol</label>
		<Input
		  value={this.state.symbol}
		  onChange={event => this.setState({ symbol: this.processSymbol(event.target.value) })}
		  placeholder='BACH'
		/>
	      </Form.Field>
	      <Form.Field>
		<label>Price (per token - optional)</label>
		<Input
		  label='Ether'
		  labelPosition='right'
		  value={this.state.price}
		  onChange={event => this.setState({ price: floatsOnly(event.target.value) })}
		  placeholder="0.04"
		/>
	      </Form.Field>
	      <Form.Field
		required
		control={Select}
		label='Type'
		options={options}
		placeholder='Type'
		onChange={this.handleChange}
	      />
	    </Form.Group>
	    <Form.Group widths='equal'>
	      <Form.Field required>
		<label>Image</label>
	      <Input
		id="image-picker"
		type="file"
		onChange={() => this.fileHandler(event)}
	      />
	    </Form.Field>
	      <Form.Field>
		<label>Aux File (optional)</label>
	      <Input
		id="file-picker"
		type="file"
		onChange={() => this.handleExtFileChange(event)}
	      />
	    </Form.Field>	    
	    </Form.Group> 
	    <Message error color='pink' header='Error' content={this.state.errorMessage} />
	    <Message
	      success
	      color='purple'
	      header='Success'
	      content={`Contract Created at ${this.state.contractAddress}`}
	    />
	    <InfoMessage
	      isShowing={!!this.state.infoMessage}
	      header='Please Wait...'
	      content={this.state.infoMessage}
	    />
	    <Button disabled={this.state.loading || this.state.buttonDisabled} type='submit' loading={this.state.loading} content='Create' style={{ marginBottom: '10px', backgroundColor: 'rgb(72,0,72)', color: 'white' }}/>
	  </Form>
	</Layout>
      );
    }
  };
};

export default CreateContract;
