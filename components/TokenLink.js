import Link from 'next/link'
import React, { Component } from 'react'

class TokenLink extends Component {
  render() {
    if (this.props.isTokenHolder) {
      return (
	<Link
	  href={{
	    pathname: `/${this.props.address}/cont`,
	    query: [this.props.address, this.props.account]
	  }}
	>
	  <a>View My Tokens</a>
	</Link>
      );
    } else {
      return null;
    }
  }
}
export default TokenLink
