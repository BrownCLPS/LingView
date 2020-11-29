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
    // Try to return default language, if that is undefined, then just return
    // whatever the first element of the dictionary is.
    if (dictionary[DEFAULT_LOCALE] === undefined) {
      return dictionary[Object.keys(dictionary)[0]];
    }
    return dictionary[DEFAULT_LOCALE];
  }
  return dictionary[locale];
}
