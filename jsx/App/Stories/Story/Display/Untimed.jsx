import id from 'shortid';
import { Sentence } from "./Sentence.jsx";

function UntimedBlock({ sentence, sentenceId }) {
	return (
		<div className="untimedBlock">
			<span className="timeStampContainer timeStamp" data-sentence_id={sentenceId}>
				{sentenceId}
			</span>
			<Sentence sentence={sentence} />
		</div>
	);
}

export function UntimedTextDisplay({ sentences }) {
	// I/P: sentences, a list of sentences
	// O/P: the main gloss view, with several Sentences arranged vertically, each wrapped in an UntimedBlock
	// Status: tested, working
	let output = [];
	let sentenceCount = 1; 
	for (const sentence of sentences) {
		output.push(
			<UntimedBlock 
				key={id.generate()} 
				sentence={sentence} 
				sentenceId={sentenceCount} 
			/>
		);
		sentenceCount += 1; 
	}
	return <div id="untimedTextDisplay">{output}</div>;
}
