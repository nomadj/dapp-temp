import React, { Component } from 'react'
import { Card, Button } from 'semantic-ui-react'
import web3 from '../web3'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import Link from 'next/link'

export default class FileRow extends Component {
  render() {
    return (
      <Card>
	<Card.Content>
	  <Link href={this.props.uri}>
	    <Button floated='right' color='violet' size='mini' icon='download' />
	  </Link>
	  <Card.Header>{this.props.name}</Card.Header>
	</Card.Content>
      </Card>
    );
  }
}
