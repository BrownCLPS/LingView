import React from 'react';

import { Header } from './Header.jsx';
import { LocaleProvider } from './locale/LocaleContext.jsx'
import { LocaleSelect } from './locale/LocaleSelect.jsx'


export function App() {
  return (
    <LocaleProvider>
        <Header />
        <footer>
          <LocaleSelect />
        </footer>
    </LocaleProvider>
  );
}
