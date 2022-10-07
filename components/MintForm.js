import { create } from 'ipfs-http-client'
import Layout from '../components/Layout'
import { Transition, Message, Image, Card, Embed, Input, Form, Button } from 'semantic-ui-react'
import { Component, useState } from 'react'
import Header from '../components/Header'

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
    success: false
  }
  componentDidMount() {
    console.log("MintForm mounted")
  }
  
  ipfsAdd = async (file) => {
    this.setState({ isLoading: true, success: false, errorMessage: '' });
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
      console.log(added.path);
      this.setState({ isLoading: false, success: true });
    } catch (event) {
      console.log(event);
      this.setState({ errorMessage: 'Unable to process file. Only .png and .mp4 available at this time.', isLoading: false });
    }
  }

  mintNFT = async () => {
    
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
        <Form onSubmit={ event => {this.ipfsAdd(document.getElementById("imageName").files[0])}} error={!!this.state.errorMessage} success={this.state.success}>
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
