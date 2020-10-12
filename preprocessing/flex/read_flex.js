/* functions for accessing data within FLEx's Verifiable Generic XML and .flextext formats 
(after they've been parsed to JSON): */

function getDocumentID(doc) {
  return doc.$.guid;
}

function getDocumentSourceLang(doc) {
  const firstSentence = getDocumentFirstSentence(doc);
  const firstWord = getSentenceWords(firstSentence)[0];
  if (firstWord != null) {
    return getWordLang(firstWord);
  }
  const textItem = getSentenceTextItemIfExists(firstSentence);
  // since firstWord was null, assume textItem isn't
  return textItem.$.lang;
}

function documentHasTimestamps(doc) {
  return getSentenceStartTime(getDocumentFirstSentence(doc)) != null;
}

function getDocumentFirstSentence(doc) {
  const firstParagraph = getDocumentParagraphs(doc)[0];
  return getParagraphSentences(firstParagraph)[0];
}

function getDocumentParagraphs(doc) {
  let paragraphs = [];
  const wrappedParagraphs = doc.paragraphs[0].paragraph;
  for (const wrappedParagraph of wrappedParagraphs) {
    if (wrappedParagraph.phrases == null) continue; // if this paragraph is empty, skip it instead of erroring
    let paragraph = wrappedParagraph.phrases[0].word; // for Verifiable Generic XML
    if (paragraph == null) {
      paragraph = wrappedParagraph.phrases[0].phrase; // for .flextext
    }
    if (paragraph != null) {
      paragraphs.push(paragraph);
    }
  }
  return paragraphs;
}

function getParagraphSentences(paragraph) {
  let sentences = [];
  for (const sentence of paragraph) {
    sentences.push(sentence); // breakdown within wrappedSentence.words[0].word; free glosses within wrappedSentence.item
  }
  return sentences;
}

function getSentenceTextIfNoWords(sentence) {
  // After starting to gloss a sentence in FLEx, the "txt" tier disappears, 
  // replaced by the individual <word>s. In that case, we return null.
  const textItem = getSentenceTextItemIfExists(sentence);
  if (textItem != null) {
    return getFreeGlossValue(textItem);
  } else {
    return null;
  }
}

function getSentenceTextItemIfExists(sentence) {
  // When exported from ELAN, the sentence's text is formatted like a free gloss, but with type="txt".
  // Once someone starts glossing the sentence, that item disappears, replaced by individual words,
  // in which case we return null. 
  for (const gloss of sentence.item) {
    if (gloss.$.type === "txt") {
      return gloss;
    }
  }
  return null;
}

function getSentenceFreeGlosses(sentence) {
  let freeGlosses = [];
  const rawFreeGlosses = sentence.item;
  for (const gloss of rawFreeGlosses) {
    if (gloss.$.type === "gls") {
      const glossValue = gloss._;
      if (glossValue != null) {
        freeGlosses.push(gloss);
      } // else there's not actually a gloss here, just the metadata/placeholder for one
    } // else it might be type "segnum" (sentence number) or similar; we'll ignore it
  }
  return freeGlosses;
}

function getSentenceStartTime(sentence) {
  const sentenceProperties = sentence.$;
  if (sentenceProperties != null) {
    const timeString = sentenceProperties['begin-time-offset'];
    if (timeString != null) {
      return parseInt(timeString, 10);
    }
  }
  return null;
}

function getSentenceEndTime(sentence) {
  const sentenceProperties = sentence.$;
  if (sentenceProperties != null) {
    const timeString = sentenceProperties['end-time-offset'];
    if (timeString != null) {
      return parseInt(timeString, 10);
    }
  }
  return null;
}

function getSentenceSpeaker(sentence) {
  const sentenceProperties = sentence.$;
  if (sentenceProperties != null) {
    return sentenceProperties.speaker;
  }
  return null;
}

function getSentenceWords(sentence) {
  if (sentence.words == null) {
    return [];
  }
  let wordList = sentence.words[0].word;
  if (wordList == null) {
    // this happens on .flextext files if some sentences, 
    // but not this sentence, have been glossed
    return [];
  }
  return wordList;
}

function getWordMorphs(word) {
  if (word.morphemes == null) {
    return [];
  }
  return word.morphemes[0].morph;
}

function getWordLang(word) {
  return word.item[0].$.lang;
}

function getWordType(word) {
  return word.item[0].$.type;
}

function getWordValue(word) {
  return word.item[0]._;
}

function getMorphPartOfSpeech(morph) {
  if (morph.$ == null) { // I have no idea why this happens sometimes but it does
    return null;
  }
  return morph.$.type;
}

function getTiers(morph) {
  return morph.item;
}

function getTierLang(tier) {
  return tier.$.lang;
}

function getTierType(tier) {
  return tier.$.type;
}

function getTierValue(tier) {
  return tier._;
}

function getFreeGlossLang(freeGloss) {
  return freeGloss.$.lang
}

function getFreeGlossValue(freeGloss) {
  return freeGloss._;
}

module.exports = {
  getDocumentID: getDocumentID,
  getDocumentSourceLang: getDocumentSourceLang,
  documentHasTimestamps: documentHasTimestamps,
  getDocumentParagraphs: getDocumentParagraphs,
  getParagraphSentences: getParagraphSentences,
  getSentenceTextIfNoWords: getSentenceTextIfNoWords,
  getSentenceFreeGlosses: getSentenceFreeGlosses,
  getSentenceStartTime: getSentenceStartTime,
  getSentenceEndTime: getSentenceEndTime,
  getSentenceSpeaker: getSentenceSpeaker,
  getSentenceWords: getSentenceWords,
  getWordMorphs: getWordMorphs,
  getWordType: getWordType,
  getWordValue: getWordValue,
  getMorphPartOfSpeech: getMorphPartOfSpeech,
  getTiers: getTiers,
  getTierLang: getTierLang,
  getTierType: getTierType,
  getTierValue: getTierValue,
  getFreeGlossLang: getFreeGlossLang,
  getFreeGlossValue: getFreeGlossValue,
};