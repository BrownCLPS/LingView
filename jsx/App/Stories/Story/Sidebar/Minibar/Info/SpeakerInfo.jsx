import id from 'shortid';
import { metadataSpeakersText } from '~./jsx/App/locale/LocaleConstants.jsx';
import { TranslatableText } from '~./jsx/App/locale/TranslatableText.jsx'

export function SpeakerInfo({ speakers }) {
	// I/P: speakers, a map from speaker IDs to objects containing speaker names, languages, etc.
	// O/P: some nicely formatted info about these speakers
	// Status: tested, not working
	let speaker_list = [];
	if (speakers != null) {
		// Form a list of speakers:
		for (const speaker_id in speakers) {
			if (speakers.hasOwnProperty(speaker_id)) {
				const speaker_name = speakers[speaker_id]['name'];
				const speaker_display = speaker_id + ': ' + speaker_name;
				speaker_list.push(<li key={id.generate()}>{speaker_display}</li>);
			}
	 	}
		return (
			<div id="speakerList">
				<TranslatableText dictionary={metadataSpeakersText} />: <ul>{speaker_list}</ul>
			</div>
		);
	} else {
		return null;
	}
}
