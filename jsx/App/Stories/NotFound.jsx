import React from 'react';
import { notFoundPageText } from '../locale/LocaleConstants.jsx';
import { TranslatableText } from '../locale/TranslatableText.jsx';

export function NotFound() {
  return (
      <p><TranslatableText dictionary={notFoundPageText} /></p>
  );
}
