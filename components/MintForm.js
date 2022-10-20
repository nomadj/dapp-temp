import { create } from 'ipfs-http-client'
import Layout from '../components/Layout'
import { Transition, Message, Image, Card, Embed, Input, Form, Button } from 'semantic-ui-react'
import { Component, useState } from 'react'
import Header from '../components/Header'
import web3 from '../web3'
import copy from 'copy-to-clipboard'
import { abi } from '../abi'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'

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
    composer: '',
    title: '',
    performer: '',
    errorMessage: '',
    success: false,
    address: '',
    account: ''
  }
  componentDidMount() {
    // this.setState({ address: this.props.query['0'], account: this.props.query['1'] });
  }

  onSubmit = async (img) => {
    this.setState({ isLoading: true, success: false, errorMessage: '' });
    const imgCid = await this.ipfsAdd(img);
    console.log("Image Added at ", imgCid);
    const data = await this.createMeta(imgCid);
    console.log("Metadata Created");
    const metaCid = await this.ipfsAdd(data);
    console.log("Metadata Added at ", metaCid);
    const txHash = await this.mintNFT(metaCid);
    copy(txHash);
    console.log("Minting Complete ", txHash);
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
    try {
      const added = await client.add(file, { progress: prog  => console.log(`Received: ${prog}`)});
      return added.path;
    } catch (event) {
      console.log(event);
      this.setState({ errorMessage: 'Unable to process file. Only png, mp4, and JSON available at this time.', isLoading: false });
    }
  }

  mintNFT = async (cid) => {
//     try {
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
      return tx.transactionHash;
   //  } catch (err){
      this.setState({ errorMessage: err})
    // }
  }

  createMeta = async (cid) => {
    const metadata = {
      "image": `ipfs://${cid}`,
      "attributes": [
	{
	  "trait_type": "title",
	  "value": this.state.title
	},
	{
	  "trait_type": "composer",
	  "value": this.state.composer
	},
	{
	  "trait_type": "performer",
	  "value": this.state.performer
	}
      ]
    };
    const data = JSON.stringify(metadata);
    return data;
  }

  fileHandler = (event) => {
    event.preventDefault()
    this.setState({ isMp4: false, isPng: false, errorMessage: '', success: false });
    if (event.target.value.endsWith('.png')) {
      console.log('PNG DETECTED');
      this.setState({ url: URL.createObjectURL(event.target.files[0]), isPng: true });
    } else if (event.target.value.endsWith('.mp4')) {
      this.setState({ url: URL.createObjectURL(event.target.files[0]), isMp4: true });
    } else {
      console.log("Unsupported File at This Time")
    }
    console.log(this.state)
  }

  render() {
    return (
      <div>
	<h3>Mint an NFT</h3>
        <Form onSubmit={ event => {this.onSubmit(document.getElementById("imageName").files[0])}} error={!!this.state.errorMessage} success={this.state.success}>
          <Form.Field>
            <label>Title</label>
            <Input
              value={this.state.title}
              onChange={event => this.setState({ title: event.target.value })}
	      placeholder='Prelude in E'
            />
          </Form.Field>
          <Form.Field>
            <label>Composer</label>
            <Input
              value={this.state.composer}
              onChange={event => this.setState({ composer: event.target.value })}
	      placeholder='J.S. Bach'
            />
          </Form.Field>
          <Form.Field>
            <label>Performer</label>
            <Input
              value={this.state.performer}
              onChange={event => this.setState({ performer: event.target.value })}
	      placeholder="Andres Segovia"
            />
          </Form.Field>
	  <Form.Field>
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
	    content='Minted minted\ntx: {}'
	  />	  
          <Button type='submit' loading={this.state.isLoading} icon='gem' color='yellow' size='large'/>
        </Form>
	</div>
    );
  }
}

export default MintForm;
