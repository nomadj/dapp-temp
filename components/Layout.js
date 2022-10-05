import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import { Header } from './Header';
import 'semantic-ui-css/semantic.min.css';

export default function Layout({ children }) {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
}

