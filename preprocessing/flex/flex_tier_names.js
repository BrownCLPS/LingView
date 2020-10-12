/* functions for naming Flex tiers */

const isoDict = require('./iso_dict.json');

// Must return a different string for each tier type in the corpus
// so that tier names can be guaranteed to be unique.
function decodeType(type) {
  /*
  // English UI text:
    switch(type) {
        case "txt": return "morpheme (text)";
        case "cf": return "morpheme (citation form)";
        case "gls": return "morpheme gloss";
        case "msa": return "part of speech";
        case "variantTypes": return "variant type"; // indicates when a morpheme is a spelling variant, free variant, etc.
        case "hn": return "homophone number"; // indicates which of multiple look-alike morphemes it is
    default: return type;
    }
  */

  // Spanish UI text:
  switch (type) {
    case "txt":
      return "Morfema (texto)";
    case "cf":
      return "Morfema (forma típico)";
    case "gls":
      return "Glosa de morfema";
    case "msa":
      return "Parte del habla";
    case "words":
      return "Palabra";
    case "free":
      return "Frase";
    default:
      return type;
  }
}

// Must return a different string for each language in the corpus
// so that tier names can be guaranteed to be unique.
function decodeLang(lang) {

  const desiredName = "Native name"; // or we might want to use "ISO language name"
  const lcLang = lang.toLowerCase(); // ignore capitalization when decoding

  // Override the usual iso-based decoding for some language codes
  switch (lcLang) {
    // case "flex-language-name-here": return "desired-decoded-name-here";
    case "con-Latn-EC":
      return "A'ingae (Borman)";
    case "con-Latn-EC-x-dureno":
      return "A'ingae (Dureno)";
    case "defaultLang":
      return "defaultLang";

    // for Spanish UI text:
    case "en":
      return "Inglés";
    default: // fall through
  }

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
  return decodeType(type) + " " + decodeLang(lang).toLowerCase();
}

module.exports = {
  getTierName: getTierName
};
