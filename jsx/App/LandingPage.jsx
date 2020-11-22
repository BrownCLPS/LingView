import React from 'react';
import { landingPageJSX } from './LocaleConstants.jsx';
import { TranslatableText } from './TranslatableText.jsx'

export function LandingPage() {
  return (
    <div style={{ margin: "0.25in" }}>
      <TranslatableText dictionary={landingPageJSX} />
    </div>
  );
}
