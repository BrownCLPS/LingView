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
import * as Locales from './LocaleConstants.jsx';

const navTitleText = {
  [Locales.ENGLISH]: "LingView: ELAN and FLEx Web Display",
  [Locales.ESPANOL]: "LingView: Pantella Web ELAN y FLEx",
  [Locales.FRANCAIS]: "LingView: Affichage Web ELAN et FLEx",
};

const searchText = {
  [Locales.ENGLISH]: "Search",
  [Locales.ESPANOL]: "Buscar",
  [Locales.FRANCAIS]: "Chercher",
};

const aboutText = {
  [Locales.ENGLISH]: "About",
  [Locales.ESPANOL]: "Acerca de",
  [Locales.FRANCAIS]: "Sur",
};

const glossaryText = {
  [Locales.ENGLISH]: "Glossary",
  [Locales.ESPANOL]: "Glosario",
  [Locales.FRANCAIS]: "Glossaire",
};

const indexText = {
  [Locales.ENGLISH]: "Index of Texts",
  [Locales.ESPANOL]: "Índice de textos",
  [Locales.FRANCAIS]: "Index des Textes",
};


export function Header() {
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
