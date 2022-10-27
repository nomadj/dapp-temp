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
      return (
        <Link
	  href={{
	    pathname: `/${this.props.address}/join.js`,
	    query: [this.props.address, this.props.account]
	  }}
	>
	  <a>Join This Contract</a>
	</Link>
      );
    }
  }
}
export default TokenLink
