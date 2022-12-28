import { create } from 'ipfs-http-client'
import Layout from '../components/Layout'
import { Transition, Message, Image, Card, Embed, Input, Form, Button, Progress } from 'semantic-ui-react'
import { Component, useState } from 'react'
import Header from '../components/Header'
import web3 from '../web3'
import copy from 'copy-to-clipboard'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import ProgBar from '../components/ProgBar'
import InfoMessage from '../components/InfoMessage'
import Router from 'next/router'
import { proAlphaSpaces } from '../utils'

class CustomMintForm extends Component {
  render() {
    return (
      <Card>
	<Card.Content>
	  <Button disabled={this.props.disabled} color='purple' floated='right' size='mini' icon='x' onClick={this.props.onClick} />
	  <Card.Header>{this.props.traitType}</Card.Header>
	  <Card.Description>{this.props.value}</Card.Description>
	</Card.Content>
      </Card>
    );
  }
}

export default CustomMintForm;
