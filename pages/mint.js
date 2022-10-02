import { create } from 'ipfs-http-client'
import React from 'react'

export default function Mint() {
  const state = {
    image: null
  }

  async function ipfsAdd(event) {
    //    event.preventDefault();
    console.log("ipfsAdd is triggered");
    console.log(event);
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
      const added = await client.add(event, { progress: prog  => console.log(`Received: ${prog}`)});
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
  }
  
  return (
    <div>
      <label>Video To Upload</label>
      <input
	id="imageName"
	type="file"
	onChange={event => ipfsAdd(event.target.files[0])}
      />
      <button onClick={event => ipfsAdd(state.image)}>GO</button>
    </div>
  );
}
