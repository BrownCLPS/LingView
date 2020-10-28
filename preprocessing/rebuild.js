const fs = require('fs');
const path = require('path');

const flex = require('./flex/flex_to_json');
const elan = require('./elan/elan_to_json');
const buildSearch = require('./build_search').buildSearch;

const flexFilesDir = "data/flex_files/";
const elanFilesDir = "data/elan_files/";
const jsonFilesDir = "data/json_files/";
const indexFileName = "data/index.json"; // stores metadata for all documents
const searchIndexFileName = "data/search_index.json";

console.log("Converting all files to .JSON. The stories index (data/index.json), search index (data/search_index.json), and stories' metadata will also be updated during this process. Status messages will appear below:")

global.missingMediaFiles = [];

const indexPath = path.resolve(__dirname, '..', indexFileName);
if (!fs.existsSync(indexPath)) {
  console.warn("The index database (data/index.json) does not yet exist; creating a fresh one.");
  fs.writeFileSync(indexPath, '{}', 'utf8');
}

Promise.all([
  new Promise((resolve, reject) => {
    try {
      elan.preprocess_dir(elanFilesDir, jsonFilesDir, resolve);
    } catch (err) {
      reject(err);
    }
  }),
  new Promise((resolve, reject) => {
    try {
      flex.preprocessDir(flexFilesDir, jsonFilesDir, resolve);
    } catch (err) {
      reject(err);
    }
  })
])
.then(() => {
  console.log('Done preprocessing ELAN and FLEx!');

  console.log(global.missingMediaFiles.length, 'Missing media files:', global.missingMediaFiles);

  return fs.promises.readdir(path.resolve(__dirname, "..", jsonFilesDir)); // path.resolve might not be necessary here
})
.then((jsonFilesEntries) => {
  const storyJsonFileNames = jsonFilesEntries.filter(s => s.endsWith('.json'))
  const searchIndex = buildSearch(storyJsonFileNames);
  // Note: overwriting any pre-existing data/search_index.json
  return fs.promises.writeFile(searchIndexFileName, JSON.stringify(searchIndex), 'utf8');
})
.then(() => {
  console.log('Successfully built and wrote search index.')
})
.catch((err) => {
  console.error('Error encountered in rebuild script:');
  console.error(err);
});
