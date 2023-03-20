import { Card } from 'semantic-ui-react'
import React, { Component } from 'react'
import Link from 'next/link'

class RequestsCard extends Component {
  render() {
    if (this.props.isShowing && this.props.requestsCount > 0) {
      return (
	<Card.Content>
	  <Card.Header>Requests Pending</Card.Header>
	  <Card.Meta>{this.props.requestsCount}</Card.Meta>
	  <Card.Description>{
	    <Link href={{ pathname: `/${this.props.address}/requests`, query: [this.props.address, this.props.account] }}>
	      <a style={{ color: 'rgb(0,0,150)' }} >view requests</a>
	    </Link>
	  }
	  </Card.Description>
	</Card.Content>
      );
    } else {
      return null
    }
  }
}
export default RequestsCard;
