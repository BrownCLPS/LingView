/* 
Functions for naming Flex tiers. 
Edit these if you want tier names to display differently on your LingView site. 
*/

const isoDict = require('./iso_dict.json');

// Must return a different string for each tier type in the corpus
// so that tier names can be guaranteed to be unique.
function decodeType(type) {
  /*
  // English UI text:
    switch(type) {
        case "txt": return "morpheme (as in the text)";
        case "cf": return "morpheme (citation form)";
        case "gls": return "morpheme gloss";
        case "msa": return "part of speech";
        case "variantTypes": return "type of variant"; // indicates when a morpheme is a spelling variant, free variant, etc.
        case "hn": return "homophone number"; // indicates which of multiple look-alike morphemes it is
    default: return type;
    }
  */

  // Spanish UI text:
  switch (type) {
    case "txt":
      return "morfema (como en el texto)";
    case "cf":
      return "morfema (forma típica)";
    case "gls":
      return "glosa de morfema";
    case "msa":
      return "parte del habla";
    case "variantTypes":
      return "clase de variedad";
    case "hn":
      return "número de homòfono";
    case "words":
      return "palabra";
    case "free":
      return "frase";
    default:
      return type;
  }
}

// Must return a different string for each language in the corpus
// so that tier names can be guaranteed to be unique.
function decodeLang(lang) {
  
  const desiredName = "Native name (endonym)"; // or we might want to use "ISO language name"
  // Override the usual iso-based decoding for some language codes
  switch (lang) {
    // case "flex-language-name-here": return "desired-decoded-name-here";
    case "con-Latn-EC":
      return "a'ingae (ortografía Borman)";
    case "con-Latn-EC-x-dureno":
      return "a'ingae (ortografía nueva)";
    case "defaultLang":
      return "defaultLang";

    // for Spanish UI text:
    case "en":
      return "inglés";

    default: // fall through
  }

  const lcLang = lang.toLowerCase(); // ignore capitalization when decoding

  // if lang is an iso code, decode it
  if (isoDict.hasOwnProperty(lcLang)) {
    return isoDict[lcLang][desiredName];
  }

  // if lang starts with a (three-letter or two-letter) iso code, decode it
  const firstThreeLetters = lcLang.substr(0, 3);
  if (isoDict.hasOwnProperty(firstThreeLetters)) {
    return isoDict[firstThreeLetters][desiredName];
  }
  const firstTwoLetters = lcLang.substr(0, 2);
  if (isoDict.hasOwnProperty(firstTwoLetters)) {
    return isoDict[firstTwoLetters][desiredName];
  }

  // as a last resort, return without decoding
  return lang;
}

// Note: LingView assumes that each tier has a unique name. 
// If getTierName returns the same name for two different tiers in your corpus,
// some features (specifically, showing/hiding tiers and narrowing the search 
// results via checkboxes) will work incorrectly. 
function getTierName(lang, type) {
  // English UI text:
  // return decodeLang(lang) + " " + decodeType(type);

  // Spanish UI text:
  return decodeType(type) + " en " + decodeLang(lang);
}

module.exports = {
  getTierName: getTierName
};
