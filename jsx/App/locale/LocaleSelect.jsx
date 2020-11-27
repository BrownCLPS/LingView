import React, { useContext } from 'react';
import { LocaleContext } from "./LocaleContext.jsx"
import * as LocaleConstants from './LocaleConstants.jsx';

/**
 * Selection component for choosing language. This updates the LocaleContext value
 * which will trigger all TranslatableText components to rerender.
 */

export const LocaleSelect = () => {
  const { locale, setLocale } = useContext(LocaleContext);
  const handleSelect = e => setLocale(e.target.value);
  return (
    <select name="locale" id="locale-select" className="localeSelector" onChange={handleSelect} value={locale}>
      <option value={LocaleConstants.ENGLISH}>English</option>
      <option value={LocaleConstants.ESPANOL}>Español</option>
      <option value={LocaleConstants.FRANCAIS}>Français</option>
    </select>
  );
}
