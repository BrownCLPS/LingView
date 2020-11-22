import React from 'react';
import * as Locales from './LocaleConstants.jsx';
import { TranslatableText } from './TranslatableText.jsx'

const glossaryPageText = {
  [Locales.ENGLISH] :
    <div>
      <p>Input glossary here :) </p>
      <p>To customize this welcome text, edit the jsx/App/AboutPage.jsx file, then run webpack for your changes to take effect. </p>
    </div>,
  [Locales.ESPANOL] :
    <div>
      <p>Ingrese el glosario aquí :) </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/GlossaryPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
  [Locales.FRANCAIS] :
    <div>
      <p>Saisissez le glossaire ici :) </p>
      <p>Pour personnaliser ce texte de bienvenue, modifiez le fichier 'jsx/App/GlossaryPage.jsx', puis exécutez webpack pour que vos modifications prennent effet. </p>
    </div>,
};

export function GlossaryPage() {
  return (
      <div style={{margin: "0.25in"}}>
        <TranslatableText dictionary={glossaryPageText} />
      </div>
  );
}
