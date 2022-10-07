import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import 'semantic-ui-css/semantic.min.css';

// export default props => {
class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
  return (
    <Container>
      <Head title="Fastload">
	<title>READY. FASTLOAD</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Mint your own NFTs"
        />
      </Head>
      <Header ref={this.myRef} />
      {this.props.children}
    </Container>
  );
  }
}
export default Layout;

