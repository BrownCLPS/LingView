import { metadataDescriptionText, metadataAuthorText, metadataGenreText, metadataDateText, metadataGlosserText, metadataSourceText } from '~./jsx/App/locale/LocaleConstants.jsx';
import { TranslatableText } from '~./jsx/App/locale/TranslatableText.jsx'

export function Metadata({ metadata }) {
	// I/P: metadata, in JSON format
	// O/P: a nice display of speaker names + other metadata
	// Status: finished
	let description = null;
	let author = null;
	let genre = null;
	let date_created = null;

	if (metadata["description"] != "") {
		description = <p><b><TranslatableText dictionary={metadataDescriptionText} />:</b> {metadata["description"]}</p>;
	}

	if (metadata["author"] != "") {
		author = <p><TranslatableText dictionary={metadataAuthorText} />: {metadata["author"]}</p>;
	}

	if (metadata["genre"] != "") {
		genre = <p><TranslatableText dictionary={metadataGenreText} />: {metadata["genre"]}</p>;
	}

	if (metadata["date_created"] != "") {
		date_created = <p><TranslatableText dictionary={metadataDateText} />: {metadata["date_created"]}</p>;
	}

	return (
		<div id="metadata">
			{description}
			{author}
		</div>
	);
}

export function MoreMetadata({ metadata }) {
	// I/P: metadata, in JSON format
	// O/P: glosser + source information
	// Status: finished
	let glosser = null;
	let source = null;


	if (metadata["glosser"] != "") {
		glosser = <p><TranslatableText dictionary={metadataGlosserText} />: {metadata["glosser"]}</p>;
	}

	if (metadata["source"]["_default"] != "") {
		source = <p><TranslatableText dictionary={metadataSourceText} />: {metadata["source"]["_default"]}</p>;
	} else if (metadata["source"].hasOwnProperty("con-Latn-EC") && metadata["source"]["con-Latn-EC"] != "") {
		source = <p><TranslatableText dictionary={metadataSourceText} />: {metadata["source"]["con-Latn-EC"]}</p>;
	}

	return (
		<div id="metadata">
			{source}
			{glosser}
		</div>
	);
}
