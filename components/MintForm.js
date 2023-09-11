import { create } from 'ipfs-http-client'
import Layout from '../components/Layout'
import { Divier, Message, Image, Card, Embed, Input, Form, Button, Progress, Icon } from 'semantic-ui-react'
import { Component, useState } from 'react'
import Header from '../components/Header'
import web3 from '../web3'
import copy from 'copy-to-clipboard'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import ProgBar from '../components/ProgBar'
import InfoMessage from '../components/InfoMessage'
import Router from 'next/router'
import { proAlphaSpaces, proAlphaLower } from '../utils'

class MultiCard extends Component {
  render() {
    if (this.props.isMp4) {
      return (
	<Card>
	  <Embed url={this.props.url} active={true} />
	  <Card.Content>
	    <Card.Header>
	      {this.props.name}
	    </Card.Header>
	  </Card.Content>
	</Card>
      )
    } else if (this.props.isPng) {
      return (
	<Card>
	  <Image src={this.props.url} alt='/64kOrange.png' wrapped ui={false} />
	  <Card.Content>
	    <Card.Header>
	      {this.props.name}
	    </Card.Header>
	  </Card.Content>
	</Card>
      )
    } else {
      return null
    }
  }
}

class MintForm extends Component {
  state = {
    isLoading: false,
    url: '',
    isPng: false,
    isMp4: false,
    description: '',
    name: '',
    performer: '',
    tokenType: '',
    errorMessage: '',
    success: false,
    address: '',
    account: '',
    fileSize: 0,
    progPct: 0,
    isInteracting: false,
    isShowingProg: false,
    infoMessage: '',
    txHash: '',
    uri: '',
    auxUri: '',
    attributes: [],
    trait_type: '',
    value: '',
    buttonDisabled: false,
    animUrl: '',
    auxUrl: ''
  }
  handleExtFileChange = (event) => {
    this.setState({ errorMessage: '', infoMessage: '', success: false });
    try {
      const { type, name } = event.target.files[0];

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

  onSubmit = async (img) => {
    const { name, description, performer, animUrl } = this.state;
    try {
      if (img.type !== 'image/png' && img.type !== 'video/mp4' && img.type !== 'image/jpeg') {
	throw { message: 'Select a different file. Only png, jpg, and mp4 supported at this time.' }
      } else if (this.state.animUrl !== '' || this.state.auxUrl !== '') {
	this.setState({ isLoading: true, success: false, errorMessage: '', infoMessage: 'Pinning content to IPFS' });
	await this.ipfsAddExt(document.getElementById('file-picker').files[0]);
      } else if (name === '' || description === '' || performer === '') {
	throw { message: 'Please enter all required fields' }
      }
      this.setState({ isLoading: true, success: false, errorMessage: '' });
      await this.ipfsAdd(img);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }
  
  ipfsAdd = async (file) => {
    this.setState({ isShowingProg: true, infoMessage: 'Adding file to IPFS' });
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
      const added = await client.add(file, { progress: prog  => this.setState({ progPct: ((prog / this.state.fileSize) * 100) })}, { pin: true });
      this.setState({ isShowingProg: false, infoMessage: '' });
      if (this.state.auxUrl !== '' || this.state.animUrl !== '') {      
	const auxHash = await this.ipfsAddExt(document.getElementById("file-picker").files[0]);
	this.setState({ auxFile: `ipfs://${auxHash}` });
      }
      await this.createCustomMeta(added.path);
    } catch (event) {
      this.setState({ errorMessage: 'Unable to process file. Only png, mp4, and JSON available at this time.', isLoading: false, isShowingProg: false, infoMessage: '' });
    }
  }

  ipfsAddJSON = async (file) => {
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
      // const added = await client.add(file, { progress: prog  => console.log(`Received: ${prog}`)});
      const added = await client.add(file);
      await this.mintNFT(added.path);
    } catch (error) {
      this.setState({ errorMessage: error.message, isLoading: false });
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
      //const added = await client.add(file, { progress: prog  => console.log(`Received: ${prog}`)});
      const added = await client.add(file);
      this.setState({ auxFile: `ipfs://${added.path}` });
    } catch (error) {
      this.setState({ errorMessage: error.message, isLoading: false, infoMessage: '' });
    }
  }    

  mintNFT = async (cid) => {
    this.setState({ isInteracting: true, infoMessage: 'Interacting with the EVM' });
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      // const price = (this.props.owner != accounts[0]) ? this.props.price : this.props.mintFee;
      const tx = await contract.methods.mint(accounts[0], `ipfs://${cid}`, this.props.mintId).send({from: accounts[0], value: this.props.price});
      this.setState({ success: true });
      this.setState({ isLoading: false, success: true, isInteracting: false, infoMessage: '', txHash: tx.transactionHash });
      setTimeout(() => Router.push({ pathname: `/${this.props.contractName}` }), 3000);
    } catch (error){
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      this.setState({ errorMessage: error.message, isLoading: false, infoMessage: '' })
    }
  }

  createCustomMeta = async (cid) => {
    try {
      const metadata = {
	name: this.state.name,
	description: this.state.description,
	image: `ipfs://${cid}`,
	animation_url: this.state.animUrl !== "" ? this.state.auxFile : "",
	aux_uri: this.state.auxUrl !== "" ? this.state.auxFile : "",
	attributes: this.state.attributes
      }
      const data = JSON.stringify(metadata);
      this.ipfsAddJSON(data);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  createMeta = async (cid) => {
    try {
      const metadata = {
	"name": this.state.name,
	"description": this.state.description,
	"image": `ipfs://${cid}`,
	"animation_url": this.state.animUrl,
	"attributes": [
	  {
	    "trait_type": "type",
	    "value": "career"
	  },	  
	  {
	    "trait_type": "skill",
	    "value": "musician"
	  },
	  {
	    "trait_type": "aux",
	    "value": this.state.auxUri
	  }
	]
      };
      const data = JSON.stringify(metadata);
      await this.ipfsAddJSON(data);
    } catch (error) {
      this.setState({ errorMessage: error, isLoading: false });
    }
  }

  fileHandler = (event) => {
    event.preventDefault()
    this.setState({ isMp4: false, isPng: false, errorMessage: '', success: false, fileSize: '' });
    if (event.target.value.endsWith('.png') || event.target.value.endsWith('.jpg')) {
      
      this.setState({ url: URL.createObjectURL(event.target.files[0]), isPng: true, fileSize: event.target.files[0].size });
    } else if (event.target.value.endsWith('.mp4')) {
      this.setState({ url: URL.createObjectURL(event.target.files[0]), isMp4: true, fileSize: event.target.files[0].size });
    } else {
      this.setState({ errorMessage: 'Unsupported file at this time.' });
    }
  }

  addAttribute = () => {
    this.setState({ attributes: [...this.state.attributes, { trait_type: this.state.trait_type, value: this.state.value }], buttonDisabled: true });
    setTimeout(() => this.setState({ buttonDisabled: false, trait_type: '', value: '' }), );
  }
  deleteAttr = (index) => {
    this.setState({ attrButtonDisabled: true });
    let attrs = this.state.attributes;
    attrs.splice(index, 1);
    this.setState({ attributes: attrs, attrButtonDisabled: false });
  }

  renderAttributes = () => {
    return this.state.attributes.map((attribute, index) => {
      return (
	<Card key={index}>
	  <Card.Content>
	  <Button disabled={this.state.attrButtonDisabled} onClick={() => this.deleteAttr(index)} style={{ backgroundColor: 'rgb(0,0,100)', color: 'white' }} floated='right' size='mini' icon='x' type='button' />
	    <Card.Header>{attribute.trait_type}</Card.Header>
	    <Card.Description>{attribute.value}</Card.Description>
	  </Card.Content>
	</Card>
      );
    });
  }

  render() {
    if (this.props.contractType === 'musician') {
      return (
	<div>
	  <h3>Mint an NFT</h3>
	  <Form onSubmit={ event => {this.onSubmit(document.getElementById("imageName").files[0])}} error={!!this.state.errorMessage} success={this.state.success}>
	    <Form.Group widths='equal'>
	      <Form.Field required>
		<label>Name</label>
		<Input 
		  value={this.state.name}
		  onChange={event => this.setState({ name: proAlphaSpaces(event.target.value) })}
		  placeholder="Prelude a l'apres-midi d'un Faune"
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Description</label>
		<Input
		  value={this.state.description}
		  onChange={event => this.setState({ description: proAlphaSpaces(event.target.value) })}
		  placeholder="University entrance audition for flute performance."
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Performer</label>
		<Input
		  value={this.state.performer}
		  onChange={event => this.setState({ performer: proAlphaSpaces(event.target.value) })}
		  placeholder="Polly Peachum"
		/>
	      </Form.Field>
	    </Form.Group>
	    <Form.Group style={{ marginBottom: '10px', marginTop: '5px' }} widths='equal' > 
	      <Form.Field required>
		<label>Image or Video</label>
		<Input
		  id="imageName"
		  type="file"
		  onChange={() => this.fileHandler(event)}
		/>
	      </Form.Field>
	      <Form.Field>
		<label>Aux File</label>
		<Input
		  id="file-picker"
		  type="file"
		  onChange={() => this.handleExtFileChange(event)}
		/>		
	      </Form.Field>	      
	    </Form.Group>
	    <Message error color='pink' header="Error" content={this.state.errorMessage} />
	    <Message
	      success
	      color='purple'
	      header='Success'
	      content={`Minted at transaction ${this.state.txHash}`}
	    />
	    <InfoMessage isShowing={this.state.isLoading} header="Please Wait" content={this.state.infoMessage} />	  
	    <ProgBar isShowing={this.state.isShowingProg} percent={this.state.progPct} color='orange' />
	    <MultiCard isMp4={this.state.isMp4} isPng={this.state.isPng} url={this.state.url}/>
	    <Button disabled={this.state.isLoading} type='submit' loading={this.state.isLoading} icon='ethereum' size='large' style={{ marginBottom: '10px', backgroundColor: 'rgb(72,0,72)', color: 'white' }}/>
	  </Form>
	</div>
      );
    } else if (this.props.contractType === 'custom') {
      return (
	<div>
	  <h3>Mint an NFT</h3>
	  <Form onSubmit={ event => {this.onSubmit(document.getElementById("imageName").files[0])}} error={!!this.state.errorMessage} success={this.state.success}>
	    <Form.Group widths='equal'>
	      <Form.Field required>
		<label>Name</label>
		<Input
		  value={this.state.name}
		  onChange={event => this.setState({ name: proAlphaSpaces(event.target.value) })}
		  placeholder='Superman'
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Description</label>
		<Input
		  value={this.state.description}
		  onChange={event => this.setState({ description: proAlphaSpaces(event.target.value) })}
		  placeholder='The man of steel, aka Clark Kent'
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Creator</label>
		<Input
		  value={this.state.performer}
		  onChange={event => this.setState({ performer: proAlphaSpaces(event.target.value) })}
		  placeholder='Joe Shuster and Jerry Siegel'
		/>
	      </Form.Field>
	    </Form.Group>
	    <Form.Group style={{ marginBottom: '10px', marginTop: '5px' }} widths='equal' > 
	      <Form.Field required>
		<label>Image or Video</label>
		<Input
		  id="imageName"
		  type="file"
		  onChange={() => this.fileHandler(event)}
		/>
	      </Form.Field>
	      <Form.Field>
		<label>Aux File</label>
		<Input
		  id="file-picker"
		  type="file"
		  onChange={() => this.handleExtFileChange(event)}
		/>		
	      </Form.Field>	      
	    </Form.Group>
	    <div>
	      <Form.Group style={{ marginLeft: '5px'}}>
		<Card.Group>
		  {this.renderAttributes()}
		</Card.Group>
	      </Form.Group>
	    </div>
	    <b>Add Attributes</b>
	    <Form.Group widths='equal' style={{ marginTop: '5px' }}>
	      <Form.Field>
		<Input
		  value={this.state.trait_type}
		  onChange={event => this.setState({ trait_type: event.target.value })}
		  placeholder='superpower'
		/>
	      </Form.Field>
	      <Form.Field>
		<Input
		  value={this.state.value}
		  onChange={event => this.setState({ value: event.target.value })}
		  placeholder='xray vision'
		  label={<Button floated='right' style={{ backgroundColor: 'rgb(0,0,100)', color: 'white' }} disabled={this.state.buttonDisabled} onClick={this.addAttribute}>Add</Button>}
		  labelPosition='right'
		/>
	      </Form.Field>
	    </Form.Group>
	    <Message error color='pink' header="Error" content={this.state.errorMessage} />
	    <Message
	      success
	      color='purple'
	      header='Success'
	      content={`Minted at transaction ${this.state.txHash}`}
	    />
	    <InfoMessage
	      isShowing={this.state.isLoading}
	      header="Please Wait"
	      content={this.state.infoMessage}
	    />	  
	    <ProgBar
	      isShowing={this.state.isShowingProg}
	      percent={this.state.progPct}
	      color='purple'
	    />
	    <MultiCard
	      isMp4={this.state.isMp4}
	      isPng={this.state.isPng}
	      url={this.state.url}
	    />
	    <Button
	      disabled={this.state.isLoading}
	      type='submit'
	      loading={this.state.isLoading}
	      content='Mint'
	      size='large'
	      style={{ marginBottom: '10px', backgroundColor: 'rgb(72,0,72)', color: 'white' }}
	    />
	  </Form>
	</div>
      );
    } else if (this.props.contractType === 'data') {
      return (
	<div>
	  <h3>Mint an NFT</h3>
	  <Form onSubmit={ event => {this.onSubmit(document.getElementById("imageName").files[0])}} error={!!this.state.errorMessage} success={this.state.success}>
	    <Form.Group widths='equal'>
	      <Form.Field required>
		<label>Name</label>
		<Input
		  value={this.state.name}
		  onChange={event => this.setState({ name: proAlphaSpaces(event.target.value) })}
		  placeholder='Blood Work'
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Description</label>
		<Input
		  value={this.state.description}
		  onChange={event => this.setState({ description: proAlphaSpaces(event.target.value) })}
		  placeholder='Test administered in San Francisco, CA by Dr. Vera Sharpe on January 20th, 2022. Analysis performed by Quest Diagnostics, 450 Sutter St. Unit 2540, San Francisco, CA 94108.'
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Creator</label>
		<Input
		  value={this.state.performer}
		  onChange={event => this.setState({ performer: proAlphaSpaces(event.target.value) })}
		  placeholder='Suky Tawdry'
		/>
	      </Form.Field>
	    </Form.Group>
	    <Form.Group style={{ marginBottom: '10px', marginTop: '5px' }} widths='equal' > 
	      <Form.Field required>
		<label>Image or Video</label>
		<Input
		  id="imageName"
		  type="file"
		  onChange={() => this.fileHandler(event)}
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Aux File</label>
		<Input
		  id="file-picker"
		  type="file"
		  onChange={() => this.handleExtFileChange(event)}
		/>		
	      </Form.Field>
	    </Form.Group>
	    <div>
	      <Form.Group style={{ marginLeft: '5px'}}>
		<Card.Group>
		  {this.renderAttributes()}
		</Card.Group>
	      </Form.Group>
	    </div>
	    <b>Add Attributes</b>
	    <Form.Group widths='equal' style={{ marginTop: '5px' }}>
	      <Form.Field>
		<Input
		  value={this.state.trait_type}
		  onChange={event => this.setState({ trait_type: event.target.value })}
		  placeholder='medical'
		/>
	      </Form.Field>
	      <Form.Field>
		<Input
		  value={this.state.value}
		  onChange={event => this.setState({ value: event.target.value })}
		  placeholder='lab results'
		  label={<Button floated='right' style={{ backgroundColor: 'rgb(0,0,100)', color: 'white' }} disabled={this.state.buttonDisabled} onClick={this.addAttribute}>Add</Button>}
		  labelPosition='right'
		/>
	      </Form.Field>
	    </Form.Group>
	    <Message error color='pink' header="Error" content={this.state.errorMessage} />
	    <Message
	      success
	      color='purple'
	      header='Success'
	      content={`Minted at transaction ${this.state.txHash}`}
	    />
	    <InfoMessage
	      isShowing={this.state.isLoading}
	      header="Please Wait"
	      content={this.state.infoMessage}
	    />	  
	    <ProgBar
	      isShowing={this.state.isShowingProg}
	      percent={this.state.progPct}
	      color='purple'
	    />
	    <MultiCard
	      isMp4={this.state.isMp4}
	      isPng={this.state.isPng}
	      url={this.state.url}
	    />
	    <Button
	      disabled={this.state.isLoading}
	      type='submit'
	      loading={this.state.isLoading}
	      content='Mint'
	      size='large'
	      style={{ marginBottom: '10px', backgroundColor: 'rgb(72,0,72)', color: 'white' }}
	    />
	  </Form>
	</div>	
      );
    } else if (this.props.contractType === 'gaming') {
      return (
	<div>
	  <h3>Mint an NFT</h3>
	  <Form onSubmit={ event => {this.onSubmit(document.getElementById("imageName").files[0])}} error={!!this.state.errorMessage} success={this.state.success}>
	    <Form.Group widths='equal'>
	      <Form.Field required>
		<label>Name</label>
		<Input
		  value={this.state.name}
		  onChange={event => this.setState({ name: proAlphaSpaces(event.target.value) })}
		  placeholder='enchanted sword'
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Description</label>
		<Input
		  value={this.state.description}
		  onChange={event => this.setState({ description: proAlphaSpaces(event.target.value) })}
		  placeholder='Sword extension with magical properties'
		/>
	      </Form.Field>
	      <Form.Field required>
		<label>Creator</label>
		<Input
		  value={this.state.performer}
		  onChange={event => this.setState({ performer: proAlphaSpaces(event.target.value) })}
		  placeholder='Jane Smith'
		/>
	      </Form.Field>
	    </Form.Group>
	    <Form.Group style={{ marginBottom: '10px', marginTop: '5px' }} widths='equal' > 
	      <Form.Field required>
		<label>Image or Video</label>
		<Input
		  id="imageName"
		  type="file"
		  onChange={() => this.fileHandler(event)}
		/>
	      </Form.Field>
	      <Form.Field>
		<label>Aux File</label>
		<Input
		  multiple
		  id="file-picker"
		  type="file"
		  onChange={() => this.handleExtFileChange(event)}
		/>		
	      </Form.Field>
	    </Form.Group>
	    <div>
	      <Form.Group style={{ marginLeft: '5px'}}>
		<Card.Group>
		  {this.renderAttributes()}
		</Card.Group>
	      </Form.Group>
	    </div>
	    <b>Add Attributes</b>
	    <Form.Group widths='equal' style={{ marginTop: '5px' }}>
	      <Form.Field>
		<Input
		  value={this.state.trait_type}
		  onChange={event => this.setState({ trait_type: event.target.value })}
		  placeholder='magic'
		/>
	      </Form.Field>
	      <Form.Field>
		<Input
		  value={this.state.value}
		  onChange={event => this.setState({ value: event.target.value })}
		  placeholder='healing'
		  label={<Button floated='right' style={{ backgroundColor: 'rgb(0,0,100)', color: 'white' }} disabled={this.state.buttonDisabled} onClick={this.addAttribute}>Add</Button>}
		  labelPosition='right'
		/>
	      </Form.Field>
	    </Form.Group>
	    <Message error color='pink' header="Error" content={this.state.errorMessage} />
	    <Message
	      success
	      color='purple'
	      header='Success'
	      content={`Minted at transaction ${this.state.txHash}`}
	    />
	    <InfoMessage
	      isShowing={this.state.isLoading}
	      header="Please Wait"
	      content={this.state.infoMessage}
	    />	  
	    <ProgBar
	      isShowing={this.state.isShowingProg}
	      percent={this.state.progPct}
	      color='purple'
	    />
	    <MultiCard
	      isMp4={this.state.isMp4}
	      isPng={this.state.isPng}
	      url={this.state.url}
	    />
	    <Button
	      disabled={this.state.isLoading}
	      type='submit'
	      loading={this.state.isLoading}
	      content='Mint'
	      size='large'
	      style={{ marginBottom: '10px', backgroundColor: 'rgb(72,0,72)', color: 'white' }}
	    />
	  </Form>
	</div>
      );
    }
  }
}

export default MintForm;
