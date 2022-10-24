import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Card, Image, Embed } from 'semantic-ui-react'

class NFT extends React.Component {
  render() {
    if (this.props.type === 'image/png') {
      return (
        <Card color='olive'>
	  <Image src={this.props.url} wrapped ui={false} />
	  <Card.Content>
	    <Card.Header>
	      <Link href="/">
		<a>{this.props.name}</a>
	      </Link>
	    </Card.Header>
	  </Card.Content>
	</Card>
      );
    } else {
      return (
	<Card color='olive'>
	  <Embed url={this.props.url} active={true} />    
	  <Card.Content>
	    <Card.Header>
	      <Link href="/">
		<a>{this.props.name}</a>
	      </Link>
	    </Card.Header>
	  </Card.Content>
	</Card>
      );
    }
  }
}
export default NFT;

  
