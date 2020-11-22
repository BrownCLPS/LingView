// Put language constants here to use in your display.
export const ENGLISH = "en";
export const ESPANOL = "es";
export const FRANCAIS = "fr";

// Put default language here.
export const DEFAULT_LOCALE = ENGLISH;

export const LOCAL_STORAGE_LOCALE_KEY = "lingview-locale";

// Below, write the text or JSX that goes in various parts of the website for
// each language.

// NavBar text (header).
export const navBarTitleText = {
  [ENGLISH]: "LingView: ELAN and FLEx Web Display",
  [ESPANOL]: "LingView: Pantella Web ELAN y FLEx",
  [FRANCAIS]: "LingView: Affichage Web ELAN et FLEx",
};

export const navBarSearchText = {
  [ENGLISH]: "Search",
  [ESPANOL]: "Buscar",
  [FRANCAIS]: "Chercher",
};

export const navBarAboutText = {
  [ENGLISH]: "About",
  [ESPANOL]: "Acerca de",
  [FRANCAIS]: "Sur",
};

export const navBarGlossaryText = {
  [ENGLISH]: "Glossary",
  [ESPANOL]: "Glosario",
  [FRANCAIS]: "Glossaire",
};

export const navBarIndexText = {
  [ENGLISH]: "Index of Texts",
  [ESPANOL]: "Índice de textos",
  [FRANCAIS]: "Index des Textes",
};

// About page, can be formatted however one pleases using JSX.

export const aboutPageJSX = {
  [ENGLISH]:
    <div>
      <p>Input content here :) </p>
      <p>To customize this welcome text, edit the jsx/App/AboutPage.jsx file, then run webpack for your changes to take effect. </p>
    </div>,
  [ESPANOL]:
    <div>
      <p>Ingrese el contenido aquí :) </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/AboutPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
  [FRANCAIS]:
    <div>
      <p>Saisissez le contenu ici :) </p>
      <p>Pour personnaliser ce texte de bienvenue, modifiez le fichier 'jsx/App/AboutPage.jsx', puis exécutez webpack pour que vos modifications prennent effet. </p>
    </div>,
};

// Glossary page, can be formatted however one pleases using JSX.

export const glossaryPageJSX = {
  [ENGLISH] :
    <div>
      <p>Input glossary here :) </p>
      <p>To customize this welcome text, edit the jsx/App/AboutPage.jsx file, then run webpack for your changes to take effect. </p>
    </div>,
  [ESPANOL] :
    <div>
      <p>Ingrese el glosario aquí :) </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/GlossaryPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
  [FRANCAIS] :
    <div>
      <p>Saisissez le glossaire ici :) </p>
      <p>Pour personnaliser ce texte de bienvenue, modifiez le fichier 'jsx/App/GlossaryPage.jsx', puis exécutez webpack pour que vos modifications prennent effet. </p>
    </div>,
};

// Landing page, can be formatted however one pleases using JSX.

export const landingPageJSX = {
  [ENGLISH]:
    <div>
      <p>Welcome! This website is powered by LingView. Click <a href='#/index'>"Index of Texts"</a> to see some example texts.</p>
      <p>To customize this welcome text, edit the jsx/App/LandingPage.jsx file, then run webpack for your changes to take effect. </p>
    </div>,
  [ESPANOL]:
    <div>
      <p>¡Bienvenido! Este sitio web funciona con LingView. Haga clic <a href='#/index'>"Índice de textos"</a> para ver algunos textos de ejemplo. </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/LandingPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
  [FRANCAIS]:
    <div>
      <p>Bienvenue! Ce site Web est alimenté par LingView. Cliquez <a href='#/index'>"Index des Textes"</a> pour voir quelques exemples de textes. </p>
      <p>Pour personnaliser ce texte de bienvenue, modifiez le fichier 'jsx/App/LandingPage.jsx', puis exécutez webpack pour que vos modifications prennent effet. </p>
    </div>,
};

// Search page text
export const searchPagePromptText = {
  [ENGLISH] : "Search database:",
  [ESPANOL] : "Buscar en la base de datos:",
  [FRANCAIS] : "Rechercher dans la base de données:",
};
