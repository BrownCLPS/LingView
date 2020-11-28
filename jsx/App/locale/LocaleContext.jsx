import React, { useState } from 'react';
import { DEFAULT_LOCALE } from './LocaleConstants.jsx';

const LOCAL_STORAGE_KEY = "lingview-locale";

const LocaleContext = React.createContext();

const LocaleProvider = ({ children }) => {
  /**
   * Use lazy initial state to get language from localStorage if present.
   * This allows language selection to persist when page reloads.
   */
  let [locale, setLocaleState] = useState(() => {
    return window.localStorage.getItem(LOCAL_STORAGE_KEY) || DEFAULT_LOCALE
  });

  const provider = {
    locale,
    setLocale: selected => {
      setLocaleState(selected);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, selected);
    }
  };
  return (
    <LocaleContext.Provider value={provider}>
      {children}
    </LocaleContext.Provider>
  );

};

export { LocaleContext, LocaleProvider };
