import React from 'react';

function renderEn() {
  return (
    <p> Hi! </p>
  );
}

function renderFr() {
  return (
    <p> Bonjour! </p>
  );
}

function renderSp() {
  return (
    <p> Hola! </p>
  );
}

export function AboutPage({ lang }) {
  let text;
  if (lang === "en") {
    text = renderEn();
  }
  else if (lang == "fr") {
    text = renderFr();
  }
  else if (lang == "sp") {
    text = renderSp();
  }
  return (
      <div style={{margin: "0.25in"}}>
      {text}
      </div>
  );
}
