import Layout from '../components/Layout'
import MintForm from '../components/MintForm'
import { Component } from 'react'
import Header from '../components/Header'


// 'https://fastload.infura-ipfs.io/ipfs/QmVbCAog9NFUMnuanNh76HkCQv6EoEaZ87E48Lbx23JYgr'

export async function getServerSideProps(props) {
  const address = props.query['0'];
  return {
    props: {
      address
    }
  }
}

class Mint extends Component {
  render() {
    return (
      <Layout>
	<Header />
	<MintForm address={this.props.address}/>
      </Layout>
    );
  }
}
export default Mint;
