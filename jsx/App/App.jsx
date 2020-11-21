import React, { useState } from 'react';
// // import id from 'shortid';
import { DEFAULT_LANG } from './LanguageConstants.jsx';
import { Footer } from './Footer.jsx';
import { Header } from './Header.jsx';


export function App({ data }) {
    const [lang, setLang] = useState(DEFAULT_LANG);
    return (
    <div>
      <Header lang={lang}/>
      <Footer setLang={setLang}/>
     </div>
    );
}
