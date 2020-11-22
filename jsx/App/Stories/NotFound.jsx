import React from 'react';
import { notFoundPageText } from './../LocaleConstants.jsx';
import { TranslatableText } from './../TranslatableText.jsx'

export function NotFound() {
  return (
      <p><TranslatableText dictionary={notFoundPageText} /></p>
  );
}
