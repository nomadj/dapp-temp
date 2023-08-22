import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

class NoMetamask extends React.Component {
  render() {
    return (
      <div>
	<p style={{textAlign: 'center' }}>
	  Please download
	  <Link legacyBehavior href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'>
	    <a style={{ color: '#DB6E00' }}> Metamask </a>
	  </Link>
	  from a Chrome desktop browser to view this page.
	</p>
      </div>
    );
  }
}

export default NoMetamask;

  
