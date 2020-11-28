import React from 'react';
import { ENGLISH, ESPANOL, FRANCAIS } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const glossaryPageJSX = {
  [ENGLISH] :
    <div>
      <p>Input glossary here :) </p>
      <p>To customize this welcome text, edit the jsx/App/GlossaryPage.jsx file, then run webpack for your changes to take effect. </p>
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

export function GlossaryPage() {
  return <TranslatableText dictionary={glossaryPageJSX} />;
}
