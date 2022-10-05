import Head from 'next/head'
import Link from 'next/link'
// import 'semantic-ui-css/semantic.min.css'
import React from 'react'
import { Card, Image, Embed } from 'semantic-ui-react'

// <Image src={image} wrapped ui={false} />

class NFT extends React.Component {
  render() {
    return (
      <Card fluid color='pink'>
	<Embed url={this.props.url} active={true} />    
	<Card.Content>
	  <Card.Header>
	    {this.props.name}
	  </Card.Header>
	</Card.Content>
      </Card>
    );
  }
}
export default NFT;

  
