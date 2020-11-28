import { Title } from './Title.jsx';
import { Video } from './Video.jsx';
import { Minibar } from './Minibar/Minibar.jsx'
import { getMediaFilePath } from '../Story.jsx';

export function Sidebar({ metadata }) {
	// I/P: metadata, in JSON format
	// O/P: a sidebar complement to the TextDisplay
	// Status: untested

	let title = metadata['title']['con-Latn-EC'];
	if (metadata['title']['_default'] != '') {
		title = metadata['title']['_default'];
	}

	if (metadata['timed'] && metadata['media']['video'] != '') {
		const filename = metadata['media']['video'];
		const path = getMediaFilePath(filename);
		return (
			<div id="leftPanel">
				<Video path={path} />
				<Title title={title} />
				<Minibar metadata={metadata} hasVideo />
			</div>
		);
	} else {
		return (
			<div id="leftPanel">
				<Title title={title} />
				<Minibar metadata={metadata} hasVideo={false} />
			</div>
		);
	}
}
