import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'

export async getServerSideProps() {
  const contName = props.query['cont'];
  const addr = props.query['0'];
  return {
    props: {
      
    }
  }
}

export default class TokenShow extends Component {
  render() {
    return (
      <Card.Group>
      </Card.Group>
    );
  }
}

