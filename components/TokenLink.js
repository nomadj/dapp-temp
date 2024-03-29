import Link from 'next/link'
import React, { Component } from 'react'

class TokenLink extends Component {
  render() {
    if (this.props.isTokenHolder || this.props.isOwner) {
      return (
	<Link
	  href={{
	    pathname: `/${this.props.name}/cont`,
	    query: [this.props.address, this.props.account, this.props.mintData[0].minted, this.props.mintData[0].mintAllowance, this.props.mintData[0].mintId]
	  }}
	>
	  <h3><a style={{ color: 'rgb(0,0,150)' }}>View my tokens</a></h3>
	</Link>
      );
    } else {
      return null;
    }
  }
}
export default TokenLink;
