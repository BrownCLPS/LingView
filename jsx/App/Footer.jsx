import React from 'react';

export function Footer({ setLang }) {
  function handleSelect(event) {
      let value = event.target.value;
      setLang(value);
  }
  return (
    <footer id="footer">
      <select id="lang" onChange={(e) => handleSelect(e)}>
        <option value="en">English</option>
        <option value="sp">Spanish</option>
        <option value="fr">French</option>
      </select>
    </footer>
  );
}
