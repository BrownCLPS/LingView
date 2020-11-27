import React from 'react';
import { aboutPageJSX } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

export function AboutPage() {
  return <TranslatableText dictionary={aboutPageJSX} />;
}
