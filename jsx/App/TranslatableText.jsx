import React, { useContext } from 'react';
import { LocaleContext } from "./LocaleContext.jsx"

/**
 * Component for rendering text in the currently selected language.
 */
export const TranslatableText = ({ dictionary }) => {
  const { locale } = useContext(LocaleContext);
  if (!dictionary[locale]) {
    // Render warning or throw error instead?
    console.error(`[TranslatableText] No translation for ${locale} in provided dictionary`);
  }
  return dictionary[locale];
}
