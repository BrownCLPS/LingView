const fs = require('fs');

function verifyMedia(filename) {
  // I/P: filename, a .mp3 or .mp4 file
  // O/P: boolean, whether or not file exists in media_files directory
  // Status: untested
  const media_files = fs.readdirSync("data/media_files");
  return (media_files.indexOf(filename) >= 0);
}

function getMetadataFromIndex(filename) {
  // I/P: filename, an XML or EAF file
  // O/P: a JSON object with metadata for the given file;
  //      or null if filename not in index
  // Status: tested, working
  const index = JSON.parse(fs.readFileSync("data/index.json", "utf8"));
  if (index.hasOwnProperty(filename)) {
    return index[filename];
  } else {
    return null;
  }
}

function getFilenameFromPath(path) {
  // I/P: path, a string
  // O/P: the filename which occurs at the end of the path
  // Status: untested
  const begin = path.lastIndexOf("/") + 1; // @Kalinda, this might fail on windows.
  return path.substring(begin, path.length);
}

function improveFLExIndexData(path, storyID, itext) {
  // I/P: path, a string
  //      itext, an interlinear text, e.g., jsonIn["document"]["interlinear-text"][0]
  // O/P: a JSON object, based on the index.json file and new metadata
  // Status: untested
  let metadata = getMetadataFromIndex(storyID);

  const date = new Date();
  const prettyDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

  if (metadata == null) { // file not in index previously
    // below is the starter data:
    metadata = {
      "timed": false,
      "story ID": storyID,
      "title": {
        "_default": ""
      },
      "media": {
        "audio": "",
        "video": ""
      },
      "languages": [],
      "date_created": "",
      "date_uploaded": prettyDate,
      "source": {
        "_default": ""
      },
      "description": "",
      "genre": "",
      "author": "",
      "glosser": "",
      "speakers": [],
      "xml_file_name": path,
      "source_filetype": "FLEx"
    }
  }

  // get title/source info
  const titlesAndSources = itext["item"];
  let titles = {};
  let sources = {};
  for (const current_title of titlesAndSources) {
    if (current_title['$']['type'] === 'title') {
      titles[(current_title["$"]["lang"])] = current_title["_"];
    } else if (current_title['$']['type'] === 'source') {
      sources[(current_title["$"]["lang"])] = current_title["_"];
    }
  }
  titles["_default"] = metadata["title"]["_default"];
  sources["_default"] = metadata["source"]["_default"];
  metadata["title"] = titles;
  metadata["source"] = sources;

  // get language info
  let languages = [];
  const languageData = itext["languages"][0]["language"];
  for (const language of languageData) {
    languages.push(language["$"]["lang"])
  }
  metadata["languages"] = languages;
  return metadata;
}

function improveElanIndexData(path, storyID, adoc) {
  // I/P: path, a string
  //      storyID, a string
  //      adoc, an annotation document
  // O/P: a JSON object, based on the index.json file and new metadata
  // Status: untested
  const filename = getFilenameFromPath(path);
  const shortFilename = filename.substring(0, filename.lastIndexOf('.'));
  const shortestFilename = filename.substring(0, filename.indexOf('.')); // more possible matches for .postflex.flextext files
  let metadata = getMetadataFromIndex(storyID);

  const date = new Date();
  const prettyDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

  if (metadata == null) { // file not in index previously
    // below is the starter data:
    metadata = {
      "timed": true,
      "story ID": storyID,
      "title": {
        "_default": ""
      },
      "media": {
        "audio": "",
        "video": ""
      },
      "languages": [],
      "date_created": "",
      "date_uploaded": prettyDate,
      "source": {
        "_default": ""
      },
      "description": "",
      "genre": "",
      "author": "",
      "glosser": "",
      "speakers": [],
      "xml_file_name": path,
      "source_filetype": "ELAN"
    }
  }

  metadata['timed'] = true;

  // get title/source info
  if (metadata['title']['_default'] === '') {
    metadata['title']['_default'] = shortFilename
  }

  // get language info
  let speakers = new Set(); // to avoid duplicates
  const tiers = adoc['TIER']
  for (const tier of tiers) {
    if (tier['$']['PARTICIPANT']) {
      speakers.add(tier['$']['PARTICIPANT']);
    }
  }
  metadata['speakers'] = Array.from(speakers);

  const audioFile = metadata['media']['audio'];
  let hasWorkingAudio = verifyMedia(audioFile);
  if (!hasWorkingAudio) {
    metadata['media']['audio'] = "";
  }
  const videoFile = metadata['media']['video'];
  let hasWorkingVideo = verifyMedia(videoFile);
  if (!hasWorkingVideo) {
    metadata['media']['video'] = "";
  }

  // If both audio/video work, then we're done. Otherwise, figure out what we need.
  let needsAudio = false;
  let needsVideo = false;
  let audioFiles = [];
  let videoFiles = [];
  if (!hasWorkingAudio || !hasWorkingVideo) {
    let mediaDescriptors = adoc['HEADER'][0]['MEDIA_DESCRIPTOR'];
		if (mediaDescriptors == null) { // this happens on ELAN->FLEx->ELAN files
			mediaDescriptors = []; // don't error when iterating over mediaDescriptors
		}
    for (const mediaDesc of mediaDescriptors) {
      const mediaPath = mediaDesc['$']['MEDIA_URL'];
      const mediaFilename = getFilenameFromPath(mediaPath);
      const fileExtension = mediaFilename.substring(mediaFilename.lastIndexOf('.'));
      if (fileExtension.toLowerCase() === '.mp3' || fileExtension.toLowerCase() === '.wav') {
        audioFiles.push(mediaFilename);
        needsAudio = true;
      } else if (fileExtension.toLowerCase() === '.mp4') {
        videoFiles.push(mediaFilename);
        needsVideo = true;
      }
    }
  }
  ////////////////////
  /// AUDIO SEARCH ///
  ////////////////////
  // Try to link audio files mentioned in the EAF file:
  if (needsAudio && !hasWorkingAudio) {
    console.log("🚨  WARN: " + filename + " is missing correctly linked audio. Attemping to find link...");
    for (const mediaFilename of audioFiles) {
      if (verifyMedia(mediaFilename)) {
        console.log("🔍  SUCCESS: Found matching audio: " + mediaFilename);
        hasWorkingAudio = true;
        metadata['media']['audio'] = mediaFilename;
        break;
      }
    }
  }

  // Try to find an audio file matching the filename:
  if (needsAudio && !hasWorkingAudio) {
    for (const tryName of [shortFilename, shortestFilename]) {
      const tryMp3 = tryName + ".mp3";
      if (verifyMedia(tryMp3)) {
        console.log("🔍  SUCCESS: Found matching audio: " + tryMp3);
        hasWorkingAudio = true;
        metadata['media']['audio'] = tryMp3;
        break;
      }
    }
  }

  // Show audio error:
  if (needsAudio && !hasWorkingAudio) {
    console.log("❌  ERROR: Cannot find matching audio for " + filename + ". ");
  }

  ////////////////////
  /// VIDEO SEARCH ///
  ////////////////////
  // Try to link video files mentioned in the EAF file:
  if (needsVideo && !hasWorkingVideo) {
    console.log("🚨  WARN: " + filename + " is missing correctly linked video. Attemping to find link...");
    for (const mediaFilename of videoFiles) {
      if (verifyMedia(mediaFilename)) {
        console.log("🔍  SUCCESS: Found matching video: " + mediaFilename);
        hasWorkingVideo = true;
        metadata['media']['video'] = mediaFilename;
        break;
      }
    }
  }

  // Try to find an video file matching the filename:
  if (needsVideo && !hasWorkingVideo) {
    for (const tryName of [shortFilename, shortestFilename]) {
      const tryMp4 = tryName + ".mp4";
      if (verifyMedia(tryMp4)) {
        console.log("🔍  SUCCESS: Found matching video: " + tryMp4);
        hasWorkingVideo = true;
        metadata['media']['video'] = tryMp4;
        break;
      }
    }
  }

  // Show audio error:
  if (needsVideo && !hasWorkingVideo) {
    console.log("❌  ERROR: Cannot find matching video for " + filename + ". ");
  }

  // WORST CASE SCENARIO: NO MEDIA
  if (!hasWorkingAudio && !hasWorkingVideo) {
    metadata['timed'] = false;
    console.log("❌  ERROR: " + filename + " has no linked audio or video in the media_files directory. It will be processed as an untimed file and no audio, video, or time alignment will be displayed on the site.")
  }

  return metadata;
}

module.exports = {
  verifyMedia: verifyMedia,
  getMetadataFromIndex: getMetadataFromIndex,
  getFilenameFromPath: getFilenameFromPath,
  improveFLExIndexData: improveFLExIndexData,
  improveElanIndexData: improveElanIndexData
};