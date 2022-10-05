import { create } from 'ipfs-http-client'
import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import { Image, Card, Embed, Input, Form, Button } from 'semantic-ui-react'

// 'https://fastload.infura-ipfs.io/ipfs/QmVbCAog9NFUMnuanNh76HkCQv6EoEaZ87E48Lbx23JYgr'
export default function Mint() {
  const [state, setState] = useState({ isLoading: false, isShowing: false, isMp4: false, isPng: false, url: ''});

  function CardComponent(props) {
    if (props.isShowing && props.isMp4) {
      console.log("MP4")
      return (
	<Card>
	  <Embed url={props.url} active={true} />
	  <Card.Content>
	    <Card.Header>
	      {props.name}
	    </Card.Header>
	  </Card.Content>
	</Card>
      )
    } else if (props.isShowing && props.isPng) {
      console.log("PNG")
      return (
      <Card>
	<Image src={props.url} wrapped ui={false} />
	<Card.Content>
	  <Card.Header>
	    {props.name}
	  </Card.Header>
	</Card.Content>
      </Card>
      )
    } else {
      return null
    }
  }
  
  async function ipfsAdd(file) {
    setState({ isLoading: true });
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
    } catch (event) {
      console.log(event);
    }
    setState({ isLoading: false });
  }
  
  return (
    <Layout>
      <CardComponent isShowing={state.isShowing} url={state.url} name="Your mother" isMp4={state.isMp4} isPng={state.isPng}/>
      <Form>
	<Form.Field>
	  <label>Video To Upload</label>
	  <Input
	    id="imageName"
	    type="file"
	    onChange={event => {
	      event.preventDefault()
	      if (event.target.value.endsWith('.png')) {
		setState({ url: URL.createObjectURL(event.target.files[0]), isShowing: true, isPng: true });
	      } else if (event.target.value.endsWith('.mp4')) {
		setState({ url: URL.createObjectURL(event.target.files[0]), isShowing: true, isMp4: true });
	      } else {
		setState({ url: URL.createObjectURL(event.target.files[0]), isShowing: false, isPng: false });
		console.log("Unsupported File at This Time")
	      }
	    }}
	  />
	  <Button loading={state.isLoading} color='pink' attached='bottom' onClick={ event => ipfsAdd(document.getElementById("imageName").files[0])}>Mint</Button>
	</Form.Field>
      </Form>
    </Layout>
  );  
}
  
