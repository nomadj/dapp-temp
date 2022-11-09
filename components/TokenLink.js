import Link from 'next/link'
import React, { Component } from 'react'

class TokenLink extends Component {
  render() {
    const { mintAllowance, minted } = this.props.clientData;
    if (this.props.isTokenHolder) {
      return (
	<Link
	  href={{
	    pathname: `/${this.props.name}/cont`,
	    query: [this.props.address, this.props.account, minted, mintAllowance]
	  }}
	>
	  <a>view my tokens</a>
	</Link>
      );
    } else {
      return null;
    }
  }
}
export default TokenLink
