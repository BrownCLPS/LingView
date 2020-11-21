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

const navTitleText = {
  [Languages.ENGLISH] : "LingView: ELAN and FLEx Web Display",
  [Languages.ESPANOL] : "LingView: Pantella Web ELAN y FLEx",
  [Languages.FRANCAIS] : "LingView: Affichage Web ELAN et FLEx",
};

const searchText = {
  [Languages.ENGLISH] : "Search",
  [Languages.ESPANOL] : "Buscar",
  [Languages.FRANCAIS] : "Chercher",
};

const aboutText = {
  [Languages.ENGLISH] : "About",
  [Languages.ESPANOL] : "Acerca de",
  [Languages.FRANCAIS] : "Sur",
};

const glossaryText = {
  [Languages.ENGLISH] : "Glossary",
  [Languages.ESPANOL] : "Glosario",
  [Languages.FRANCAIS] : "Glossaire",
};

const indexText = {
  [Languages.ENGLISH] : "Index of Texts",
  [Languages.ESPANOL] : "Índice de textos",
  [Languages.FRANCAIS] : "Index des Textes",
};


export function Header({ lang }) {
  return (
    <Router>
      <div>
        <div id="navbar">
            <div id="navTitle">
                {navTitleText[lang]}
            </div>
            <ul id="navLinks">
                 <li><a href="#/search/">{searchText[lang]}</a></li>
                 <li><a href="#/about/">{aboutText[lang]}</a></li>
                 <li><a href="#/glossary/">{glossaryText[lang]}</a></li>
                 <li><a href="#/index/">{indexText[lang]}</a></li>
            </ul>
        </div>
        <div>
            <Route exact path="/" render={props => <LandingPage {...props} lang={lang} />} />
            <Route exact path="/index" render={props => <StoryIndex {...props} lang={lang} />} />
            <Route path="/story" render={props => <Stories />} />
            <Route path="/search" render={props => <Search {...props} lang={lang} />} />
            <Route exact path="/about" render={props => <AboutPage {...props} lang={lang} />} />
            <Route exact path="/glossary" render={props => <GlossaryPage {...props} lang={lang} />} />
        </div>
      </div>
    </Router>
  );
}
