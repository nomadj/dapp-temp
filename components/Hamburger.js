import React, { useState } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Link from 'next/link';

export const Hamburger = (props) => {
  const hamStyle = {
    cursor: 'pointer',
    display: 'inline-block',
    // opacity: props.hamburgerVisible ? 0 : 1, // Control opacity based on visibility
    transition: 'opacity 0.5s ease-in-out', // Smooth opacity transition
  };
  return (
    <Icon
      name={props.hamburgerVisible ? "search" : "bars"}
      size="large"
      onClick={props.toggle}
      style={hamStyle}
    />
  );
}
