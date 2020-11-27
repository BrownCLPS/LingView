import React from 'react';
import { glossaryPageJSX } from './LocaleConstants.jsx';
import { TranslatableText } from './TranslatableText.jsx'

export function GlossaryPage() {
  return <TranslatableText dictionary={glossaryPageJSX} />;
}
