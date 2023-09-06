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
  state = {
    mobile: false
  }
  
  componentDidMount() {
    if (window.innerWidth < 800) {
      this.setState({ mobile: true });
    }
  }
  
  render() {
    if (this.state.mobile) {
      return (
	<Card.Group style={{ marginTop: '10px' }} itemsPerRow={1}> 
		<Card style={{ borderBottom: '2px solid rgba(72,0,72)' }}>
		  <Image src={this.props.image} alt='nope' />
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

		<Card style={{ borderBottom: '2px solid rgba(72,0,72)' }}>
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
		  <DownloadFiles
		    address={this.props.address}
		    fileStore={this.props.fileStore}
		    isTokenHolder={this.props.isTokenHolder}
		    isOwner={this.props.isOwner}
		  />
		</Card>	      

	</Card.Group>	
      );
    } else {
      return (
	<Card.Group style={{ marginTop: '10px' }} itemsPerRow={2}> 
		<Card style={{ borderBottom: '2px solid rgba(72,0,72)' }}>
		  <Image src={this.props.image} alt='nope' />
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

		<Card style={{ borderBottom: '2px solid rgba(72,0,72)' }}>
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
		  <DownloadFiles
		    address={this.props.address}
		    fileStore={this.props.fileStore}
		    isTokenHolder={this.props.isTokenHolder}
		    isOwner={this.props.isOwner}
		  />
		</Card>	      

	</Card.Group>	
      );
    }
  }
}
export default ContractShow;
