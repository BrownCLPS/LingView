import React from 'react';

const aboutPageText = {
  "en" : <p>Hi!</p>,
  "fr" : <p>Bonjour!</p>,
  "sp" : <p>Hola!</p>,
};

export function AboutPage({ lang }) {
  return (
      <div style={{margin: "0.25in"}}>
      {aboutPageText[lang]}
      </div>
  );
}
