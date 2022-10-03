import { create } from 'ipfs-http-client'
import { useState } from 'react'
import Layout from '../components/Layout'
import { Input, Form, Button } from 'semantic-ui-react'

export default function Mint() {
  const [state, setState] = useState({ isLoading: false });
  
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
	// if (err) {
	// 	console.log(err)
	// }
	// else {
	// 	const hash = await res[0].hash;
	// 	console.log(hash);
      // }
      console.log(added.path);
    } catch (event) {
      console.log(event);
    }
    setState({ isLoading: false });
  }
  
  // return (
  //   <div>
  //     <label>Video To Upload</label>
  //     <input
  // 	id="imageName"
  // 	type="file"
  // 	onChange={event => ipfsAdd(event.target.files[0])}
  //     />
  //     <button onClick={event => ipfsAdd(state.image)}>GO</button>
  //   </div>
  // );
  return (
    <Layout>
      <Form>
	<Form.Field>
	  <label>Video To Upload</label>
	  <Input
	    id="imageName"
	    type="file"
	  />
	  <Button loading={state.isLoading} color='pink' attached='bottom' onClick={ event => ipfsAdd(document.getElementById("imageName").files[0])}>Mint</Button>
	</Form.Field>
      </Form>
    </Layout>
  );  
}
