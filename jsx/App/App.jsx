import React, { useState } from 'react';
// // import id from 'shortid';
import { LocaleProvider } from './LocaleContext.jsx'
import { Footer } from './Footer.jsx';
import { Header } from './Header.jsx';


export function App() {
  return (
    <LocaleProvider>
        <Header />
        <Footer />
    </LocaleProvider>
  );
}
