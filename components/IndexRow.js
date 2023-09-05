import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Card, Image, Embed } from 'semantic-ui-react'
import web3 from '../web3'

class IndexRow extends React.Component {
  render() {
    return (
      <Link href={{ pathname: `/${this.props.name}` }}>
	<Card fluid style={{ overflowWrap: 'break-word', borderBottom: '2px solid rgba(72,0,72)', marginBottom: '10px' }}>
	  <Card.Content>
	    <Image src={this.props.image} alt='Nope' floated='right' size='mini' rounded style={{ width: 'auto', height: 40}}/>
	    <Card.Header>{this.props.name.replace(this.props.name.charAt(0), this.props.name.charAt(0).toUpperCase())}</Card.Header>
	    <Card.Meta>
	      {this.props.address}
	    </Card.Meta>
	  </Card.Content>
	</Card>
      </Link>
    )
  }
}
export default IndexRow;
