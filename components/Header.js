import React from 'react';
import { Image, Segment, Container, Icon, Menu, Button } from 'semantic-ui-react';
import { Header as H } from 'semantic-ui-react';
import Link from 'next/link';
import 'semantic-ui-css/semantic.min.css';
import SearchBar from '../components/SearchBar';
import DynamicButton from '../components/DynamicButton';

// export const Header = React.forwardRef((props, ref) => {
  // const HomeButton = React.forwardRef(({ href, onClick }, ref) => {
  //   return <Button color='blue' href={href} onClick={onClick} ref={ref} icon='home'/>
  // });

  // const AddButton = React.forwardRef(({ href, onClick }, ref) => {
  //   return <Button color='blue' href={href} onClick={onClick} ref={ref} icon='add circle'/>
// });

// export default () => {
class Header extends React.Component {
  render() {
    return (
      <Container style={{ marginTop: '10px', marginBottom: '15px'}}>
	  <H as='h1' icon textAlign='center'>
	    <H.Content><Image src='/forte.jpg' alt='Nope' rounded centered style={{ width: 1800, border: '30px solid rgba(72,0,72,1)' }} /></H.Content>
	  </H>
	<Menu style={{ marginBottom: '10px' }}>
	  <Menu.Item>
	    <Link href="/">
	      <Button icon='home' style= {{ backgroundColor: 'rgba(0,0,100)', color: 'white' }} />
	    </Link>
	  </Menu.Item>
	  <Menu.Item>
	    <SearchBar source={this.props.source} account={this.props.account}/>
	  </Menu.Item>
	  <Menu.Menu position='right'>
	    <Menu.Item>
	      <Link href="/createContract">
	      <Button icon='add' style= {{ backgroundColor: 'rgba(0,0,100)', color: 'white' }} />		
	      </Link>
	    </Menu.Item>
	  </Menu.Menu>
	</Menu>
      </Container>
    );
  }
}
export default Header;
