import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Card, Image, Embed } from 'semantic-ui-react'
import web3 from '../web3'

// <Image src={image} wrapped ui={false} />
// <Embed url='https://fastload.infura-ipfs.io/ipfs/QmbNWEoXzrTPSEBfHusErD9jxmtwSvgAFivK5zgMoM6smM' active={true} />

class IndexRow extends React.Component {
  render() {
    return (
      <Card fluid color='olive' style={{ overflowWrap: 'break-word' }}>
	<Card.Content>
	  <Image src={this.props.image} floated='right' size='mini' rounded />
	  <Card.Header>{this.props.name}</Card.Header>
	  <Card.Header>
	    <Link href={{ pathname: `/${this.props.name}` }}>
	      <a>{this.props.address}</a>
	    </Link>
	  </Card.Header>
	</Card.Content>
      </Card>
    )
  }
}
export default IndexRow;
