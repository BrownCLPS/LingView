import React from 'react';
import { Route } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { AboutPage } from './AboutPage.jsx';
import { LandingPage } from './LandingPage.jsx';
import { GlossaryPage } from './GlossaryPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Search } from './Search.jsx';
import { Stories } from './Stories/Stories.jsx';
import { TranslatableText } from './TranslatableText.jsx'
import { navBarTitleText, navBarSearchText, navBarAboutText, navBarIndexText, navBarGlossaryText } from './LocaleConstants.jsx';

export function Header() {
  return (
    <Router>
      <div>
        <div id="navbar">
          <div id="navTitle">
            <TranslatableText dictionary={navBarTitleText} />
          </div>
          <ul id="navLinks">
            <li><a href="#/search/"><TranslatableText dictionary={navBarSearchText} /></a></li>
            <li><a href="#/about/"><TranslatableText dictionary={navBarAboutText} /></a></li>
            <li><a href="#/glossary/">
              <TranslatableText dictionary={navBarGlossaryText} /></a></li>
            <li><a href="#/index/">{<TranslatableText dictionary={navBarIndexText} />}</a></li>
          </ul>
        </div>
        <div>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/index">
            <StoryIndex />
          </Route>
          <Route path="/story">
            <Stories />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route exact path="/about">
            <AboutPage />
          </Route>
          <Route exact path="/glossary">
            <GlossaryPage />
          </Route>
        </div>
      </div>
    </Router>
  );
}
