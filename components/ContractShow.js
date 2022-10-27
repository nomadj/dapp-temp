import { Card, Grid } from 'semantic-ui-react';
import React, { Component } from 'react';
import ContributeForm from './ContributeForm';
import DownloadButton from './DownloadButton';
import TokenLink from './TokenLink';
import Link from 'next/link';

class ContractShow extends Component {
  render() {
    return (
      <Card.Group>
	<Grid columns='equal'>
	  <Grid.Row>
	    <Grid.Column style={{marginLeft: '8px', overflowWrap: 'break-word'}}>
	      <Card
		header={this.props.name}
		meta={this.props.address}
		image={this.props.image}
		description={
		  <TokenLink isTokenHolder={this.props.isTokenHolder} />
		}
	      />
	    </Grid.Column>
	    <Grid.Column style={{marginRight: '10px'}}>
	      <Card header='Tokens Minted' description={this.props.tokenId} />
	      <Card header='Token Holders' description={this.props.tokenHolders} />
	      <ContributeForm address={this.props.address} />
	      <DownloadButton isTokenHolder={this.props.isTokenHolder} address={this.props.address} />
	    </Grid.Column>
	  </Grid.Row>
	</Grid>
      </Card.Group>
    );
  }
}
export default ContractShow
