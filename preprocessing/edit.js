const fs = require("fs");
const prompt = require("prompt");
const inquirer = require("inquirer"); // edited the node module for this
let obj = JSON.parse(fs.readFileSync("data/index.json", "utf8"));
let DB = JSON.parse(fs.readFileSync("data/database.json", "utf8"));

let filename;
let data;

let maxArgIndex = 0;

process.argv.forEach(function (val, index, array) {
  maxArgIndex = index;
  if (index === 2) {
		filename = val;
	} else if (index === 3) {
		console.log("Too many arguments. Continuing anyway...");
	}
});

if (maxArgIndex < 2) {
	console.log("To edit the metadata for a file, type: \n node preprocess/edit.js unique_id\n where unique_id is the last part of a story's URL.");
} else {
	try {
    data = obj[filename];
    main(update);
    console.log("✅" + "  " + "File found! Preparing to edit...");
  } catch (err) {
    console.log("❌" + "  " + " File not found!  \nExiting...");
  }
}

function hasTimestamps(uniqueId) {
  const stories = DB.stories;
  for (const story of stories) {
    if (story.metadata["story ID"] == uniqueId) {
      let firstSentence = story.sentences[0];
      return firstSentence.start_time_ms != null;
    }
  }
  return false; // we'll never get here
}

function main(callback) {
	inquirer.prompt([
		// mp3
		{
			"type": "input",
			"name": "audio",
			"message": "Name of mp3 file:",
			"default": data["media"]["audio"],
			"when":
				function(answers) {
					return hasTimestamps(filename);
				},
			"validate":	
				function(response) {
					const media_files = fs.readdirSync("data/media_files");
					if (media_files.indexOf(response) >= 0 || response === "") {
						return true;
					} else if (response === "blank") { // TODO: replace "blank" with "" in then()
						return true;
					} else {
						return "That file doesn't exist in your media_files directory! Please be aware that filenames are case-sensitive and require an extension. Type 'blank' to leave the file blank.";
					}
				}
		},
		// mp4
		{
			"type": "input",
			"name": "video",
			"message": "Name of mp4 file:",
			"default": data["media"]["video"],
			"when":
				function(answers) {
					return hasTimestamps(filename);
				},
			"validate":	
				function(response) {
					const media_files = fs.readdirSync("data/media_files");
					if (media_files.indexOf(response) >= 0 || response === "") {
						return true;
					} else if (response === "blank") {
						return true;
					} else {
						return "That file doesn't exist in your media_files directory! Please be aware that filenames are case-sensitive and require an extension. Type 'blank' to leave the file blank.";
					}
				}
		},
		// edit title?
		{
			"type": "input", 
			"name": "title",
			"message": "Title:",
			"default": data["title"]["_default"]
		},
		// edit description?
		{
			"type": "confirm", 
			"name": "desc_edit",
			"message": "Edit description?",
			"default": false,
			"when": 
				function(answers) {
					if (data["description"]) {
						console.log("You've already entered a description: " + '"' + data["description"] + '"');
						return true;
					} else {
						return false;
					}
				}
		},
		// description editor (probably using Vim)
		{
			"type": "editor", 
			"name": "description",
			"message": " ", // cannot be empty :(
			"default": data["description"],
			"when": 
				function(answers) {
					return (answers["desc_edit"]);
				}
		},
		// description creator
		{
			"type": "input", 
			"name": "description",
			"message": "Enter a description:",
			"when": 
				function(answers) {
					return (data["description"] === "");
				}
		},
		// genre
		{
			"type": "list", 
			"name": "genre",
			"message": "Select a genre:",
			"choices": ["Nonfiction", "Fiction", ""],
			"default": data["genre"]
		},
		// author
		{
			"type": "input", 
			"name": "author",
			"message": "Author:",
			"default": data["author"]
		},
		// glosser
		{
			"type": "input", 
			"name": "glosser",
			"message": "Who glossed it:",
			"default": data["glosser"]
		},
		// date recorded
		{
			"type": "input", 
			"name": "date_created",
			"message": "Date of creation (mm/dd/yyyy):",
			"default": data["date_created"]
		},
		// source
		{
			"type": "input", 
			"name": "source",
			"message": "Source:",
			"default": data["source"]["_default"]
		}
	// 
	]).then(function (answers) {
		if (answers["audio"] == "blank") {
			data["media"]["audio"] == "";
		} else {
			data["media"]["audio"] = answers["audio"];
		}
		if (answers["video"] == "blank") {
			data["media"]["video"] == "";
		} else {
			data["media"]["video"] = answers["video"];
		}
		data["timed"] = (data["media"]["audio"] != "") || (data["media"]["video"] != "");
		
		if (answers["description"]) {
			data["description"] = answers["description"];
		}
		data["title"]["_default"] = answers["title"];
		data["genre"] = answers["genre"];
		data["author"] = answers["author"];
		data["glosser"] = answers["glosser"];
		data["date_created"] = answers["date_created"];
		data["source"]["_default"] = answers["source"];
		callback();
	});
}

function update() {
	fs.writeFileSync("data/index.json", JSON.stringify(obj, null, 2));
	DB["index"] = obj;
	fs.writeFileSync("data/database.json", JSON.stringify(DB, null, 2));
	console.log("📤" + "  " + "Metadata edit complete.");
	console.log("\nYou've successfully edited the metadata. However, this will not be displayed on the site until you rebuild the databases and site. (You can do both using the \"quick-build-online\" or \"quick-build-offline\" npm script; for more info: https://github.com/BrownCLPS/LingView/wiki)");
}

