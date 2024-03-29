import React, { Component } from 'react'
import { Card, Grid, Accordion, Icon, Dropdown } from 'semantic-ui-react'
import web3 from '../web3'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import FileRow from '../components/FileRow'

class DownloadFiles extends Component {   // TODO: Implement downloader
  state = {
    activeIndex: 0,
    infoMessage: ''
  }
  
  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }
  
  render() {
    const { activeIndex } = this.state;
    if (this.props.isTokenHolder || this.props.isOwner) {
      const items = this.props.fileStore.map((obj, i) => {
	return <FileRow name={obj[0]} uri={obj[1]} key={i} />
      });
      if (items.length > 0) {
	return (
	  <Card.Content>
	    <div style={{marginTop: '10px'}}>
	      <h2>File Downloads</h2>
	      <Card.Group>
		<Dropdown
		  placeholder='Select File'
		  fluid
		  selection
		  options={items}
		  style={{ marginBottom: '10px' }}
		/>
	      </Card.Group>
	    </div>
	  </Card.Content>
      );
      } else {
	return (
	  <Card.Content>
	    <h3 style={{ marginLeft: '10px'}}>no downloads available</h3>
	  </Card.Content>
	);
      }
    } else {
      return (
	<Card.Content>
	  <h3 style={{ marginLeft: '10px'}}>Request to join this contract</h3>
	</Card.Content>	
      );
    }
  }
}

export default DownloadFiles;
