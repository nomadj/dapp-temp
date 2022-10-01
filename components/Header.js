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
      <Link href="/createContract" className="item">
	<Menu.Menu position='right'>
	  <Button color='blue'>+</Button>
	</Menu.Menu>
      </Link>
    </Menu>
  );
}
