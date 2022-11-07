import { Card } from 'semantic-ui-react'
import React, { Component } from 'react'
import Link from 'next/link'

class RequestsCard extends Component {
  render() {
    if (this.props.isShowing && this.props.requestsCount > 0) {
      return (
	<Card
	  header='Requests Pending'
	  meta={this.props.requestsCount}
	  description={
	    <Link href={{ pathname: `/${this.props.address}/requests`, query: [this.props.address, this.props.account] }}>
	      <a>view requests</a>
	    </Link>
	  }
	/>
      );
    } else {
      return null
    }
  }
}
export default RequestsCard
