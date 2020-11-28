import React from 'react';
import { loadingPageText } from '~./jsx/App/locale/LocaleConstants.jsx';
import { TranslatableText } from '~./jsx/App/locale/TranslatableText.jsx'

export function Loader() {
  return (
    <div className="loader">
        <TranslatableText dictionary={loadingPageText} />
    </div>
  );
}
