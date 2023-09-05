import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Link from 'next/link';

export const Hamburger = (props) => {
  if (props.hamburgerVisible) {
    return (
      <Icon
	name="search"
	size="large"
	onClick={props.toggle}
	style={{ cursor: 'pointer' }}
      />
    );
  } else {
    return (
      <Icon
	name="bars"
	size="large"
	onClick={props.toggle}
	style={{ cursor: 'pointer' }}
      />
    );
  }
}
