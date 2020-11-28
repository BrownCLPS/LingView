import { useContext } from 'react';
import { DEFAULT_LOCALE } from './LocaleConstants.jsx';
import { LocaleContext } from "./LocaleContext.jsx"

/**
 * Component for rendering text in the currently selected language.
 */
export const TranslatableText = ({ dictionary }) => {
  const { locale } = useContext(LocaleContext);
  if (dictionary[locale] === undefined) {
    console.error(`[TranslatableText] No translation for ${locale} in provided dictionary`);
    return dictionary[DEFAULT_LOCALE];
  }
  return dictionary[locale];
}
