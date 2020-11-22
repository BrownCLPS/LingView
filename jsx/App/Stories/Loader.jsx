import React from 'react';
import { loadingPageText } from './../LocaleConstants.jsx';
import { TranslatableText } from './../TranslatableText.jsx'

export function Loader() {
  return (
    <div className="loader">
        <TranslatableText dictionary={loadingPageText} />
    </div>
  );
}
