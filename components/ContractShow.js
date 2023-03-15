import { Card, Grid, Image, Container } from 'semantic-ui-react';
import React, { Component } from 'react';
import ContributeForm from './ContributeForm';
import DownloadButton from './DownloadButton';
import TokenLink from './TokenLink';
import Link from 'next/link';
import RequestForm from './RequestForm';
import RequestsCard from './RequestsCard';
import UploadForm from './UploadForm';
import DownloadFiles from './DownloadFiles';

class ContractShow extends Component {
  render() {
    return (
      <Card.Group style={{ marginTop: '10px' }} > 
	<Grid columns='equal'>
	  <Grid.Row>
	    <Grid.Column style={{ marginLeft: '6px', overflowWrap: 'break-word'}}>
	      <Card style={{ borderBottom: '2px solid rgba(50,128,175)' }}>
		<Image src={this.props.image} alt='/64kOrange.png' />
		<Card.Content>
		  <Card.Description>
		    <TokenLink
		      isTokenHolder={this.props.isTokenHolder}
		      address={this.props.address}
		      account={this.props.account}
		      name={this.props.name}
		      mintData={this.props.mintData}
		      isOwner={this.props.isOwner}
		    />
		  </Card.Description>
		  <ContributeForm
		    address={this.props.address}
		  />
		</Card.Content>
	      </Card>
	    </Grid.Column>
	    <Grid.Column>
	      <Card style={{ borderBottom: '2px solid rgba(50,128,175)' }}>
		<Card.Content>
		  <Card.Header>Tokens Minted</Card.Header>
		  <Card.Meta>{this.props.tokenId}</Card.Meta>
		</Card.Content>
		<RequestsCard
		  isShowing={this.props.isOwner}
		  requestsCount={this.props.requestsCount}
		  address={this.props.address}
		  account={this.props.account}
		/>
		<UploadForm
		  isShowing={this.props.isOwner}
		  address={this.props.address}
		  projectId={this.props.projectId}
		  projectSecret={this.props.projectSecret}
		/>
		<RequestForm
		  isShowing={!this.props.isTokenHolder}
		  address={this.props.address}
		  isApproved={this.props.isApproved}
		  isTokenHolder={this.props.isTokenHolder}
		  onFinalize={this.props.onFinalize}
		  loading={this.props.loading}
		  userName={this.props.userName}
		  metadata={this.props.metadata}
		  isPending={this.props.isPending}
		  contractName={this.props.name}
		  projectId={this.props.projectId}
		  projectSecret={this.props.projectSecret}
		  price={this.props.price}
		  isOwner={this.props.isOwner}
		/>
	      </Card>	      
	    </Grid.Column>
	    <Grid.Column>
	      <Card style={{ borderBottom: '2px solid rgba(50,128,175)' }}>
		<DownloadFiles
		  address={this.props.address}
		  fileStore={this.props.fileStore}
		  isTokenHolder={this.props.isTokenHolder}
		  isOwner={this.props.isOwner}
		/>
	      </Card>
	    </Grid.Column>
	  </Grid.Row>
	</Grid>
      </Card.Group>
    );
  }
}
export default ContractShow;
