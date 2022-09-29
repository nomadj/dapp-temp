import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import Link from 'next/link';
import 'semantic-ui-css/semantic.min.css'

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link href="/" className="item">
	<Button color='blue'>Home</Button>
      </Link>
      <Menu.Menu position="right">
	<Link href="/" className="item">Home</Link>
      </Menu.Menu>
    </Menu>
  );
}
