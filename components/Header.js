import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import Link from 'next/link';
import 'semantic-ui-css/semantic.min.css'

export const Header = React.forwardRef((props, ref) => {
  // const HomeButton = React.forwardRef(({ href, onClick }, ref) => {
  //   return <Button color='blue' href={href} onClick={onClick} ref={ref} icon='home'/>
  // });

  // const AddButton = React.forwardRef(({ href, onClick }, ref) => {
  //   return <Button color='blue' href={href} onClick={onClick} ref={ref} icon='add circle'/>
  // });

  return (
    <Menu style={{ marginTop: '10px' }}>
      <Menu.Item>
	<Link href="/" className="item" passHref>
      	  <Button color='blue' icon='home' />
	</Link>
      </Menu.Item>
      <Menu.Menu position='right'>
	<Menu.Item>
	  <Link href="/createContract" className="item" passHref>
      	    <Button color='blue' icon='add circle' />
	  </Link>
	</Menu.Item>
      </Menu.Menu>
    </Menu>
  );
});
