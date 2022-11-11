import Layout from '../components/Layout'
import MintForm from '../components/MintForm'
import { Component } from 'react'
import Header from '../components/Header'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import web3 from '../web3'

// 'https://fastload.infura-ipfs.io/ipfs/QmVbCAog9NFUMnuanNh76HkCQv6EoEaZ87E48Lbx23JYgr'

export async function getServerSideProps(props) {
  const address = props.query['0'];
  const mintId = props.query['1'];
  const contract = new web3.eth.Contract(Tambora.abi, address);
  const contractName = await contract.methods.name().call();
  return {
    props: {
      address,
      mintId,
      contractName
    }
  }
}

class Mint extends Component {
  render() {
    return (
      <Layout>
	<Header />
	<MintForm address={this.props.address} mintId={this.props.mintId} contractName={this.props.contractName} />
      </Layout>
    );
  }
}
export default Mint;
