import { Sidebar } from './Sidebar/Sidebar.jsx';
import { CenterPanel } from './Display/CenterPanel.jsx';
import { Video } from './Sidebar/Video.jsx';
import { setupTextSync } from './lib/txt_sync';
import { Loader } from '../Loader.jsx';

export class Story extends React.Component {
    constructor(props) {
        super(props);
        this.state = { story: null };
      }
    async componentDidMount() {
        const storyJSON = await import(`~./data/json_files/${this.props.storyID}.json`);
        this.setState({ story: storyJSON.default });

        setupTextSync();

        // If there is a footer, i.e., if audio exists:
        if ($('#footer').length !== 0) {
            // If video exists:
            if ($('#video').length !== 0) {
                Video.show();
            } else {
                Video.hide();
            }
        }
    }

    render() {
        if (!this.state.story) {
            return <Loader />;
        }

        const story = this.state.story;
        const sentences = story['sentences'];
        const timed = (story['metadata']['timed']);
        let footer = null;
        if (timed) {
            let audioFile;
            const media = story['metadata']['media'];
            if (media.hasOwnProperty('audio')) {
                audioFile = media['audio'];
            } else {
                audioFile = media['video'];
            }
            const audioFilePath = getMediaFilePath(audioFile);
            footer = <div id="footer"><audio data-live="true" controls controlsList="nodownload" id="audio" src={audioFilePath}/></div>;
        }
        return (
            <div>
                <div id="middle">
                    <Sidebar metadata={story['metadata']}/>
                    <CenterPanel timed={timed} sentences={sentences}/>
                </div>
                {footer}
            </div>
        );
    }
}

export function getMediaFilePath(mediaFilename) {
    return /^(\w)+:\/\//i.test(mediaFilename) ? mediaFilename : `data/media_files/${mediaFilename}`;
}
