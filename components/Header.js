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
	<Segment color='orange' inverted>
	  <H as='h1' icon textAlign='center'>
	    <H.Content><Image src='/64kOrange.png' alt='/64kOrange.png' size='large' centered /></H.Content>
	  </H>
	</Segment>
	<Menu style={{ marginBottom: '10px' }}>
	  <Menu.Item>
	    <Link href="/">
	      <Button color='yellow' icon='home' />
	    </Link>
	  </Menu.Item>
	  <Menu.Item>
	    <SearchBar source={this.props.source} account={this.props.account}/>
	  </Menu.Item>
	  <Menu.Menu position='right'>
	    <Menu.Item>
	      <Link href="/createContract">
		<Button color='yellow' icon='add circle' />
	      </Link>
	    </Menu.Item>
	  </Menu.Menu>
	</Menu>
      </Container>
    );
  }
}
export default Header;
