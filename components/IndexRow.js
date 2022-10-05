import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Card, Image, Embed } from 'semantic-ui-react'

// <Image src={image} wrapped ui={false} />
// <Embed url='https://fastload.infura-ipfs.io/ipfs/QmbNWEoXzrTPSEBfHusErD9jxmtwSvgAFivK5zgMoM6smM' active={true} />

class IndexRow extends React.Component {
  render() {
    const MyButton = React.forwardRef(({ onClick, href }, ref) => {
      return (
	<a href={href} onClick={onClick} ref={ref}>
	  {this.props.name}
	</a>
      );
    });
    
    return (
      <Card fluid color='pink'>
	<Card.Content>
	  <Card.Header>
	    <Link href={{ pathname: `/${this.props.name}`, query: [this.props.address, this.props.name] }} passHref>
	      <MyButton />
	    </Link>
	  </Card.Header>
	</Card.Content>
      </Card>
    )
  }
}

export default IndexRow;
