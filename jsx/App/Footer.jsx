import React from 'react';
import { ENGLISH, ESPANOL, FRANCAIS } from './LanguageConstants.jsx';

export function Footer({ setLang }) {
  function handleSelect(event) {
      let value = event.target.value;
      setLang(value);
  }
  return (
    <footer id="footer">
      <select id="lang" onChange={(e) => handleSelect(e)}>
        <option value={ENGLISH}>English</option>
        <option value={ESPANOL}>Spanish</option>
        <option value={FRANCAIS}>French</option>
      </select>
    </footer>
  );
}
