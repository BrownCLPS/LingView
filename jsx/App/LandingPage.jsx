import React from 'react';
import { landingPageJSX } from './LocaleConstants.jsx';
import { TranslatableText } from './TranslatableText.jsx'

export function LandingPage() {
  return <TranslatableText dictionary={landingPageJSX} />;
}
