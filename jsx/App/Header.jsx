import React from 'react';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import { AboutPage } from './AboutPage.jsx';
import { LandingPage } from './LandingPage.jsx';
import { GlossaryPage } from './GlossaryPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Search } from './Search.jsx';
import { Stories } from './Stories/Stories.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'
import { navBarTitleText, navBarSearchText, navBarAboutText, navBarIndexText, navBarGlossaryText } from './locale/LocaleConstants.jsx';

export function Header() {
  return (
    <Router>
      <div id="navbar">
        <div id="navTitle">
          <Link to="/"><TranslatableText dictionary={navBarTitleText} /></Link>
        </div>
        <div id="navLinks">
          <NavLink to="/search"><TranslatableText dictionary={navBarSearchText} /></NavLink>
          <NavLink to="/about"><TranslatableText dictionary={navBarAboutText} /></NavLink>
          <NavLink to="/glossary"><TranslatableText dictionary={navBarGlossaryText} /></NavLink>
          <NavLink to="/index"><TranslatableText dictionary={navBarIndexText} /></NavLink>
        </div>
      </div>
      <div className="content">
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
    </Router>
  );
}
