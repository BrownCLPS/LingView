import React from 'react';
import { aboutPageJSX } from './LocaleConstants.jsx';
import { TranslatableText } from './TranslatableText.jsx'

export function AboutPage() {
  return <TranslatableText dictionary={aboutPageJSX} />;
}
