import React from 'react';
import { Route } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { AboutPage } from './AboutPage.jsx';
import { LandingPage } from './LandingPage.jsx';
import { GlossaryPage } from './GlossaryPage.jsx';
import { StoryIndex } from './StoryIndex.jsx';
import { Search } from './Search.jsx';
import { Stories } from './Stories/Stories.jsx';
import * as Languages from './LanguageConstants.jsx';
import { TranslatableText } from './TranslatableText.jsx'

const navTitleText = {
  [Languages.ENGLISH]: "LingView: ELAN and FLEx Web Display",
  [Languages.ESPANOL]: "LingView: Pantella Web ELAN y FLEx",
  [Languages.FRANCAIS]: "LingView: Affichage Web ELAN et FLEx",
};

const searchText = {
  [Languages.ENGLISH]: "Search",
  [Languages.ESPANOL]: "Buscar",
  [Languages.FRANCAIS]: "Chercher",
};

const aboutText = {
  [Languages.ENGLISH]: "About",
  [Languages.ESPANOL]: "Acerca de",
  [Languages.FRANCAIS]: "Sur",
};

const glossaryText = {
  [Languages.ENGLISH]: "Glossary",
  [Languages.ESPANOL]: "Glosario",
  [Languages.FRANCAIS]: "Glossaire",
};

const indexText = {
  [Languages.ENGLISH]: "Index of Texts",
  [Languages.ESPANOL]: "Índice de textos",
  [Languages.FRANCAIS]: "Index des Textes",
};


export function Header() {
  const lang = "en";
  return (
    <Router>
      <div>
        <div id="navbar">
          <div id="navTitle">
            <TranslatableText dictionary={navTitleText} />
          </div>
          <ul id="navLinks">
            <li><a href="#/search/"><TranslatableText dictionary={searchText} /></a></li>
            <li><a href="#/about/"><TranslatableText dictionary={aboutText} /></a></li>
            <li><a href="#/glossary/">
              <TranslatableText dictionary={glossaryText} /></a></li>
            <li><a href="#/index/">{<TranslatableText dictionary={indexText} />}</a></li>
          </ul>
        </div>
        <div>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/index">
            <StoryIndex />
          </Route>
          <Route exact path="/story">
            <Stories />
          </Route>
          <Route exact path="/search">
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
