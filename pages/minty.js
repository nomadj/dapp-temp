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
  const pinataJWT = process.env.PINATA_JWT;
  const contract = new web3.eth.Contract(Tambora.abi, address);
  const contractName = await contract.methods.name().call();
  const contractType = await contract.methods.contractType().call();
  const mintPrice = new web3.utils.BN(await contract.methods.price().call());
  const mintFeeBN = new web3.utils.BN(await contract.methods.mintFee().call());
  const price = mintPrice.add(mintFeeBN).toString();
  const mintFee = mintFeeBN.toString();
  const owner = await contract.methods.owner().call();
  const projectId = process.env.PROJECT_ID;
  const projectSecret = process.env.PROJECT_SECRET;
  
  return {
    props: {
      address,
      mintId,
      contractName,
      contractType,
      projectId,
      projectSecret,
      price,
      mintFee,
      owner,
      pinataJWT
    }
  }
}

class Mint extends Component {
  render() {
    return (
      <Layout>
	<MintForm contractType={this.props.contractType} address={this.props.address} mintId={this.props.mintId} contractName={this.props.contractName} projectId={this.props.projectId} projectSecret={this.props.projectSecret} price={this.props.price} mintFee={this.props.mintFee} owner={this.props.owner} pinataJWT={this.props.pinataJWT} />
      </Layout>
    );
  }
}
export default Mint;
