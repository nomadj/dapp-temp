import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../web3';
import { abi } from '../../abi';
import ContributeForm from '../../components/ContributeForm';
import Link from 'next/link';
import Header from '../../components/Header';
import DownloadButton from '../../components/DownloadButton';

export async function getServerSideProps(props) {
  const name = props.query['cont'];
  const address = props.query['0'];
  const contract = new web3.eth.Contract(abi, address);
  const tokenCount = await contract.methods.tokenId().call();
  const manager = await contract.methods.owner().call();

  return {
    props: {
      address,
      manager,
      tokenCount,
      name
    }
  };
}

class CampaignShow extends Component {

  state = {
    account: '',
    isTokenHolder: false,
    address: ''
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const contract = new web3.eth.Contract(abi, this.props.address);
    const tokenBalance = await contract.methods.balanceOf(accounts[0]).call();
    if (tokenBalance > 0) {
      this.setState({ isTokenHolder: true, address: this.props.address });
    }
  }

  renderCards() {
    const { address, manager, tokenCount, name } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Contract Creator',
        description: 'Requests to mint tokens and download materials must be approved by the controller of this account',
        style: { overflowWrap: 'break-word' },
	color: 'olive'
      },
      {
        header: name,
        meta: 'Name of Contract',
        description: 'Contract names are not always unique, be sure contract address is correct',
	color: 'olive'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
	<Header />
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
	      <DownloadButton isTokenHolder={this.state.isTokenHolder} address={this.state.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link href={{ pathname: `/${this.props.address}/cont`, query: [this.props.address, this.state.account]}}>
              <a>
                <Button color='yellow'>View Tokens</Button>
              </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
