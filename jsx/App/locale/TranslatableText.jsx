import React, { useContext } from 'react';
import { LocaleContext } from "./LocaleContext.jsx"

/**
 * Component for rendering text in the currently selected language.
 */
export const TranslatableText = ({ dictionary }) => {
  const { locale } = useContext(LocaleContext);
  if (!dictionary[locale]) {
    let defaultLocale = Object.keys(dictionary)[0];
    if (!dictionary[defaultLocale]) {
      console.error(`[TranslatableText] Dictionary object is empty.`)
    }
    console.log(`[TranslatableText] No translation for ${locale} in provided dictionary. Using ${defaultLocale}.`);
    return dictionary[defaultLocale];
  }
  return dictionary[locale];
}
