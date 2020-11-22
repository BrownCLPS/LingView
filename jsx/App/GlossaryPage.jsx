import React from 'react';
import { glossaryPageJSX } from './LocaleConstants.jsx';
import { TranslatableText } from './TranslatableText.jsx'

export function GlossaryPage() {
  return (
      <div style={{margin: "0.25in"}}>
        <TranslatableText dictionary={glossaryPageJSX} />
      </div>
  );
}
