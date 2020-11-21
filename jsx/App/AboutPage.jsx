import React from 'react';
import { ENGLISH, ESPANOL, FRANCAIS } from './LanguageConstants.jsx';

const aboutPageText = {
  [ENGLISH] :
    <div>
      <p>Input content here :) </p>
      <p>To customize this welcome text, edit the jsx/App/AboutPage.jsx file, then run webpack for your changes to take effect. </p>
    </div>,
  [ESPANOL] :
    <div>
      <p>Ingrese el contenido aquí :) </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/AboutPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
  [FRANCAIS] :
    <div>
      <p>Saisissez le contenu ici :) </p>
      <p>Pour personnaliser ce texte de bienvenue, modifiez le fichier 'jsx/App/AboutPage.jsx', puis exécutez webpack pour que vos modifications prennent effet. </p>
    </div>,
};

export function AboutPage({ lang }) {
  return (
      <div style={{margin: "0.25in"}}>
      {aboutPageText[lang]}
      </div>
  );
}
