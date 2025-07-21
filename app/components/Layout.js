import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, user, onLogout }) {
  return (
    <>
      <Header user={user} onLogout={onLogout} />
      {children}
      <Footer />
    </>
  );
} 