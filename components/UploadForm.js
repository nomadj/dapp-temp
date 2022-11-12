import React, { Component } from 'react'
import { Form, Input, Message, Button, Container, Card } from 'semantic-ui-react'
import InfoMessage from './InfoMessage'
import { create } from 'ipfs-http-client'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import web3 from '../web3'
import { proString } from '../utils'
import Router from 'next/router'

export default class UploadForm extends Component {
  state = {
    url: '',
    errorMessage: '',
    successMessage: '',
    infoMessage: '',
    isPdf: false,
    loading: false,
    name: ''
  }
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
    const basePath = 'https://fastload.infura-ipfs.io/ipfs/';
    try {
      const added = await client.add(file, { progress: prog  => console.log(`Received: ${prog}`)});
      this.setState({ infoMessage: `File added at ${basePath}${added.path}`});
      await this.addFileLocation(`${basePath}${added.path}`);
    } catch (error) {
      this.setState({ errorMessage: 'Please choose a valid pdf file', loading: false, infoMessage: '' });
    }
  }

  addFileLocation = async (uri) => {
    try {
      if (this.state.name === '') {
	throw { message: 'Please enter a name for your file' };
      }
      this.setState({ infoMessage: 'Interacting with the EVM' });
      const accounts = await web3.eth.getAccounts();
      const contract = await new web3.eth.Contract(Tambora.abi, this.props.address);
      const tx = await contract.methods.addFileLocation(this.state.name, uri).send({ from: accounts[0] });
      this.setState({ loading: false, successMessage: `Transaction complete ${tx.transactionHash}`, infoMessage: '' });
      setTimeout(() => Router.reload(window.location.pathname, 1000));
    } catch (error) {
      this.setState({ loading: false, errorMessage: error.message, infoMessage: '' });
    }
    
  }
  
  fileHandler = (event) => {
    event.preventDefault()
    this.setState({ isPdf: false, errorMessage: '', success: false });
    if (event.target.value.endsWith('.pdf') || event.target.value.endsWith('.py')) {
      this.setState({ url: URL.createObjectURL(event.target.files[0]) });
    } else {
      this.setState({ errorMessage: "Unsupported File at This Time" });
    }
  }
  onSubmit = async (pdf) => {
    this.setState({ loading: true, errorMessage: '', successMessage: '', infoMessage: 'Adding to IPFS' });
    await this.ipfsAdd(pdf);
  }
  render() {
    if (this.props.isShowing) {
      return (
	<Card.Content>
	  <Form
	    onSubmit={ event => {
	      this.onSubmit(document.getElementById('upload-picker').files[0]);
	    }}
	    error={!!this.state.errorMessage}
	    success={!!this.state.successMessage}
	  >
	    <h2>Upload File</h2>
	    <Form.Field style={{ marginBottom: '10px' }} >
	      <Message error header='Error' content={this.state.errorMessage} />
	      <Message success header='Success' content={this.state.successMessage} style={{ overflowWrap: 'break-word', marginBottom: '10px' }} />
	      <InfoMessage
		isShowing={!!this.state.infoMessage}
		header='Please Wait...'
		content={this.state.infoMessage}
	      />
	      <Input
		label={<Button disabled={this.state.loading} loading={this.state.loading} color='violet' icon='upload' size='mini' />}
		labelPosition='left'
		value={this.state.name}
		onChange={event => {
		  const ps = proString(event.target.value);
		  this.setState({ name: ps })
		}}
		placeholder='filename.pdf'
	      />
	      <Input
		type='file'
		id='upload-picker'
		onChange={() => this.fileHandler(event)}
	      />
	    </Form.Field>
	  </Form>
	</Card.Content>
      );
    } else {
      return null;
    }
  }
}
