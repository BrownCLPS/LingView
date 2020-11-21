import React from 'react';
import { Route } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { AboutPage } from './AboutPage.jsx';
import { LandingPage } from './LandingPage.jsx';
import { GlossaryPage } from './GlossaryPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Search } from './Search.jsx';
import { Stories } from './Stories/Stories.jsx';

export function Header({ lang }) {
  return (
    <Router>
      <div>
        <div id="navbar">
            <div id="navTitle">
                LingView: ELAN and FLEx Web Display
            </div>
            <ul id="navLinks">
                 <li><a href="#/search/">Search</a></li>
                 <li><a href="#/about/">About</a></li>
                 <li><a href="#/glossary/">Glossary</a></li>
                 <li><a href="#/index/">Index of Texts</a></li>
            </ul>
        </div>
        <div>
            <Route exact path="/" render={props => <LandingPage {...props} lang={lang}/>} />
            <Route exact path="/index" render={props => <StoryIndex />} />
            <Route path="/story" render={props => <Stories />} />
            <Route path="/search" render={props => <Search />} />
            <Route exact path="/about" render={props => <AboutPage {...props} lang={lang}/>} />
            <Route exact path="/glossary" render={props => <GlossaryPage {...props} lang={lang}/>} />
        </div>
      </div>
    </Router>
  );
}
