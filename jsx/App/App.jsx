import React, { useState } from 'react';
// // import id from 'shortid';
import { Route } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { LandingPage } from './LandingPage.jsx';
import { AboutPage } from './AboutPage.jsx';
import { GlossaryPage } from './GlossaryPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Search } from './Search.jsx';
import { Stories } from './Stories/Stories.jsx';


export function App({ data }) {
    const [lang, setLang] = useState("en");
    function handleSelect(event) {
        let value = event.target.value;
        setLang(value);
    }
    return (
    <div>
        <Router>
          <div>
              <Route exact path="/" render={props => <LandingPage {...props} lang={lang}/>} />
              <Route exact path="/index" render={props => <StoryIndex />} />
              <Route path="/story" render={props => <Stories />} />
              <Route path="/search" render={props => <Search />} />
              <Route exact path="/about" render={props => <AboutPage {...props} lang={lang}/>} />
              <Route exact path="/glossary" render={props => <GlossaryPage {...props} lang={lang}/>} />
          </div>
        </Router>
      <footer id="footer">
        <select id="lang" onChange={(e) => handleSelect(e)}>
          <option value="en">English</option>
          <option value="sp">Spanish</option>
          <option value="fr">French</option>
        </select>
      </footer>
     </div>
    );
}
