import React, { useContext } from 'react';
import { LocaleContext } from "./LocaleContext.jsx"
import * as Locales from './LocaleConstants.jsx';

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
        <option value={Locales.ENGLISH}>English</option>
        <option value={Locales.ESPANOL}>Spanish</option>
        <option value={Locales.FRANCAIS}>French</option>
      </select>
    </footer>
  );
}
