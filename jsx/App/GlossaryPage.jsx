import React from 'react';
import { glossaryPageJSX } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

export function GlossaryPage() {
  return <TranslatableText dictionary={glossaryPageJSX} />;
}
