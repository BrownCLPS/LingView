import React from 'react';
import { aboutPageJSX } from './LocaleConstants.jsx';
import { TranslatableText } from './TranslatableText.jsx'

export function AboutPage() {
  return (
    <div style={{ margin: "0.25in" }}>
      <TranslatableText dictionary={aboutPageJSX} />
    </div>
  );
}
