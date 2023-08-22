import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import 'semantic-ui-css/semantic.min.css';

// export default props => {
class Layout extends React.Component {
  constructor(props) {
    super(props);
    // this.myRef = React.createRef();
  }
  render() {
  return (
    <Container>
      <Head title="Fastload">
	<title>READY. FASTLOAD</title>
        <link rel="icon" type='image/x-icon' href="/eth-favicon.png" />
        <meta
          name="description"
          content="Mint your own NFTs"
        />
	<html lang="en" />
      </Head>
      <Header />
      {this.props.children}
    </Container>
  );
  }
}
export default Layout;

