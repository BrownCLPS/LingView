import React, { useState } from 'react';
// // import id from 'shortid';
import { Route } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { AboutPage } from './AboutPage.jsx';
import { Footer } from './Footer.jsx';
import { LandingPage } from './LandingPage.jsx';
import { GlossaryPage } from './GlossaryPage.jsx';
import { Header } from './Header.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Search } from './Search.jsx';
import { Stories } from './Stories/Stories.jsx';


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
