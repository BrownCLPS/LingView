import React, { useState } from 'react';
// // import id from 'shortid';
import { Footer } from './Footer.jsx';
import { Header } from './Header.jsx';


export function App({ data }) {
    const defaultLanguage = "en"
    const [lang, setLang] = useState(defaultLanguage);
    return (
    <div>
      <Header lang={lang}/>
      <Footer setLang={setLang}/>
     </div>
    );
}
