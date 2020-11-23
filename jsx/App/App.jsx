import React from 'react';

// // import id from 'shortid';
import { Footer } from './Footer.jsx';
import { Header } from './Header.jsx';
import { LocaleProvider } from './LocaleContext.jsx'


export function App() {
  return (
    <LocaleProvider>
        <Header />
        <Footer />
    </LocaleProvider>
  );
}
