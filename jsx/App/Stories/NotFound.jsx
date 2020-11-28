import React from 'react';
import { notFoundPageText } from '~./jsx/App/locale/LocaleConstants.jsx';
import { TranslatableText } from '~./jsx/App/locale/TranslatableText.jsx';

export function NotFound() {
  return (
      <p><TranslatableText dictionary={notFoundPageText} /></p>
  );
}
