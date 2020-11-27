import React from 'react';
import { landingPageJSX } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

export function LandingPage() {
  return <TranslatableText dictionary={landingPageJSX} />;
}
