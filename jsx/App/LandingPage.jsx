import React from 'react';
import { ENGLISH, ESPANOL, FRANCAIS } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const landingPageJSX = {
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

export function LandingPage() {
  return <TranslatableText dictionary={landingPageJSX} />;
}
