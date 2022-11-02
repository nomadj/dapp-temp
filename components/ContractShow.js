import { Card, Grid } from 'semantic-ui-react';
import React, { Component } from 'react';
import ContributeForm from './ContributeForm';
import DownloadButton from './DownloadButton';
import TokenLink from './TokenLink';
import Link from 'next/link';
import RequestForm from './RequestForm';
import RequestsCard from './RequestsCard';

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
		  <TokenLink isTokenHolder={this.props.isTokenHolder} address={this.props.address} account={this.props.account} />
		}
	      />
	    </Grid.Column>
	    <Grid.Column style={{marginRight: '10px'}}>
	      <Card header='Tokens Minted' meta={this.props.tokenId} />
	      <Card header='Token Holders' meta={this.props.tokenHolders} />
	      <RequestsCard isShowing={this.props.isOwner} requestsCount={this.props.requestsCount} address={this.props.address} account={this.props.account}/>
	      <DownloadButton isTokenHolder={this.props.isTokenHolder} address={this.props.address} />
	    </Grid.Column>
	  </Grid.Row>
	  <Grid.Row>
	    <Grid.Column>
	      <ContributeForm address={this.props.address} />
	    </Grid.Column>
	    <Grid.Column>
	      <RequestForm isShowing={!this.props.isTokenHolder} address={this.props.address} isApproved={this.props.isApproved} isTokenHolder={this.props.isTokenHolder} onFinalize={this.props.onFinalize} loading={this.props.loading} userName={this.props.userName} metadata={this.props.metadata} isPending={this.props.isPending} contractName={this.props.name} />
	    </Grid.Column>
	  </Grid.Row>
	</Grid>
      </Card.Group>
    );
  }
}
export default ContractShow
