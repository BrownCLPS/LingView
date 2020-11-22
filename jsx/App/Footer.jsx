import React, { useContext } from 'react';
import { LocaleContext } from "./LocaleContext.jsx"
import * as LocaleConstants from './LocaleConstants.jsx';

/**
 * Footer with component for selecting locale. This updates the LocaleContext value
 * which will trigger all TranslatableText components to rerender.
 */

export function Footer() {
  const { locale, setLocale } = useContext(LocaleContext);
  const handleSelect = e => setLocale(e.target.value);
  return (
    <footer id="footer">
      <select id="lang" onChange={handleSelect} value={locale}>
        <option value={LocaleConstants.ENGLISH}>English</option>
        <option value={LocaleConstants.ESPANOL}>Español</option>
        <option value={LocaleConstants.FRANCAIS}>Français</option>
      </select>
    </footer>
  );
}
