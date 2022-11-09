import { create } from 'ipfs-http-client'
import Layout from '../components/Layout'
import { Transition, Message, Image, Card, Embed, Input, Form, Button, Progress } from 'semantic-ui-react'
import { Component, useState } from 'react'
import Header from '../components/Header'
import web3 from '../web3'
import copy from 'copy-to-clipboard'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import ProgBar from '../components/ProgBar'
import InfoMessage from '../components/InfoMessage'

// 'https://fastload.infura-ipfs.io/ipfs/QmVbCAog9NFUMnuanNh76HkCQv6EoEaZ87E48Lbx23JYgr'
class MultiCard extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    if (this.props.isMp4) {
      console.log("MP4")
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
      console.log("PNG")
      return (
	<Card>
	  <Image src={this.props.url} wrapped ui={false} />
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
    auxUri: ''
  }
  componentDidMount() {
    // this.setState({ address: this.props.query['0'], account: this.props.query['1'] });
  }

  onSubmit = async (img) => {
    this.setState({ isLoading: true, success: false, errorMessage: '' });
    await this.ipfsAdd(img);
  }
  
  ipfsAdd = async (file) => {
    this.setState({ isShowingProg: true, infoMessage: 'Interacting with Ethereum blockchain', infoMessage: 'Adding file to IPFS' });
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
      const added = await client.add(file, { progress: prog  => this.setState({ progPct: ((prog / this.state.fileSize) * 100) })});
      this.setState({ isShowingProg: false, infoMessage: '' });
      await this.createMeta(added.path);
    } catch (event) {
      console.log(event);
      this.setState({ errorMessage: 'Unable to process file. Only png, mp4, and JSON available at this time.', isLoading: false, isShowingProg: false, infoMessage: '' });
    }
  }

  ipfsAddJSON = async (file) => {
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
      await this.mintNFT(added.path);
    } catch (event) {
      console.log(event);
      this.setState({ errorMessage: 'Unable to process file. Only png, mp4, and JSON available at this time.', isLoading: false });
    }
  }

  mintNFT = async (cid) => {
    this.setState({ isInteracting: true, infoMessage: 'Interacting with Ethereum Blockchain' });
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
      this.setState({ isLoading: false, success: true, isInteracting: false, infoMessage: '', txHash: tx.transactionHash });
      return tx.transactionHash;
    } catch (error){
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      console.log(contract.events);
      this.setState({ errorMessage: error.message, isLoading: false, infoMessage: '' })
    }
  }

  createMeta = async (cid) => {
    try {
      const metadata = {
	"name": this.state.name,
	"description": this.state.description,
	"image": `ipfs://${cid}`,
	"attributes": [
	  {
	    "trait_type": "token type",
	    "value": this.state.tokenType
	  },
	  {
	    "trait_type": "role",
	    "value": "owner"
	  },
	  {
	    "trait_type": "aux uri",
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
    if (event.target.value.endsWith('.png')) {
      
      this.setState({ url: URL.createObjectURL(event.target.files[0]), isPng: true, fileSize: event.target.files[0].size });
    } else if (event.target.value.endsWith('.mp4')) {
      this.setState({ url: URL.createObjectURL(event.target.files[0]), isMp4: true, fileSize: event.target.files[0].size });
    } else {
      console.log("Unsupported File at This Time")
    }
  }

  render() {
    return (
      <div>
	<h3>Mint an NFT</h3>
        <Form onSubmit={ event => {this.onSubmit(document.getElementById("imageName").files[0])}} error={!!this.state.errorMessage} success={this.state.success}>
	  <Form.Group widths='equal'>
	    <Form.Field required>
	      <label>Name</label>
	      <Input
		value={this.state.name}
		onChange={event => this.setState({ name: event.target.value })}
		placeholder='University Entrance Audition'
	      />
	    </Form.Field>
	    <Form.Field required>
	      <label>Description</label>
	      <Input
		value={this.state.description}
		onChange={event => this.setState({ description: event.target.value })}
		placeholder="Alice Vanderblatt performing classical guitar"
	      />
	    </Form.Field>
	    <Form.Field required>
	      <label>Owner</label>
	      <Input
		value={this.state.performer}
		onChange={event => this.setState({ performer: event.target.value })}
		placeholder="Alice Vanderblatt"
	      />
	    </Form.Field>
	  </Form.Group>
	  <Form.Field required>
	    <label>Image or Video</label>
	    <Input
	      id="imageName"
	      type="file"
	      onChange={() => this.fileHandler(event)}
	    />
	  </Form.Field>
	  <MultiCard isMp4={this.state.isMp4} isPng={this.state.isPng} url={this.state.url}/>
          <Message error header="Oops!" content={this.state.errorMessage} />
	  <Message
	    success
	    header='Success!'
	    content={`Minted at transaction ${this.state.txHash}`}
	  />
	  <InfoMessage isShowing={this.state.isLoading} header="Please Wait" content={this.state.infoMessage} />
          <Button disabled={this.state.isLoading} type='submit' loading={this.state.isLoading} icon='gem' color='yellow' size='large'/>
	  <ProgBar isShowing={this.state.isShowingProg} percent={this.state.progPct} color='orange' />
        </Form>
	</div>
    );
  }
}

export default MintForm;
