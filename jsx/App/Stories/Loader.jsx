import React from 'react';
import { loadingPageText } from '../locale/LocaleConstants.jsx';
import { TranslatableText } from '../locale/TranslatableText.jsx'

export function Loader() {
  return (
    <div className="loader">
        <TranslatableText dictionary={loadingPageText} />
    </div>
  );
}
