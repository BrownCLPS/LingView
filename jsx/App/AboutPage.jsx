import React from 'react';
import * as Languages from './LanguageConstants.jsx';
import { TranslatableText } from './TranslatableText.jsx'

const aboutPageText = {
  [Languages.ENGLISH]:
    <div>
      <p>Input content here :) </p>
      <p>To customize this welcome text, edit the jsx/App/AboutPage.jsx file, then run webpack for your changes to take effect. </p>
    </div>,
  [Languages.ESPANOL]:
    <div>
      <p>Ingrese el contenido aquí :) </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/AboutPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
  [Languages.FRANCAIS]:
    <div>
      <p>Saisissez le contenu ici :) </p>
      <p>Pour personnaliser ce texte de bienvenue, modifiez le fichier 'jsx/App/AboutPage.jsx', puis exécutez webpack pour que vos modifications prennent effet. </p>
    </div>,
};

export function AboutPage() {
  return (
    <div style={{ margin: "0.25in" }}>
      <TranslatableText dictionary={aboutPageText} />
    </div>
  );
}
