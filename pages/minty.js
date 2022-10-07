import Layout from '../components/Layout'
import MintForm from '../components/MintForm'
import { Component } from 'react'
import Header from '../components/Header'


// 'https://fastload.infura-ipfs.io/ipfs/QmVbCAog9NFUMnuanNh76HkCQv6EoEaZ87E48Lbx23JYgr'

class Mint extends Component {
  render() {
    return (
      <Layout>
	<Header />
	<MintForm />
      </Layout>
    );
  }
}
export default Mint;
