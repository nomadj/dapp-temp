import { Card } from 'semantic-ui-react'
import React, { Component } from 'react'
import Link from 'next/link'

class RequestsCard extends Component {
  render() {
    if (this.props.isShowing) {
      return (
	<Card
	  header='Requests Pending'
	  meta={this.props.requestsCount}
	  description={
	    <Link href='/'>
	      <a>View Requests</a>
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
