import Head from 'next/head'
import Link from 'next/link'
// import 'semantic-ui-css/semantic.min.css'
// import React from 'react'
import { Card, Image, Embed } from 'semantic-ui-react'

// <Image src={image} wrapped ui={false} />

export default function Member(arg) {
  return (
    <Card fluid color='pink'>
      <Embed url='https://fastload.infura-ipfs.io/ipfs/QmbNWEoXzrTPSEBfHusErD9jxmtwSvgAFivK5zgMoM6smM' active={true} />      
      <Card.Content>
	<Card.Header>
	  {arg}
	</Card.Header>
      </Card.Content>
    </Card>
  )
}
