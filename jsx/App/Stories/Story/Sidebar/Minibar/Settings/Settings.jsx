import { TierCheckboxList } from './TierCheckboxList.jsx';
import { Video } from '~./jsx/App/Stories/Story/Sidebar/Video.jsx';
import { showVideoButtonText } from '~./jsx/App/locale/LocaleConstants.jsx';
import { TranslatableText } from '~./jsx/App/locale/TranslatableText.jsx'

class VideoButton extends React.Component {
  // I/P: --
  // O/P: a button that can show/hide video, reset "player" ID, etc.
  constructor(props) {
    super(props);
    this.state = {
      checkboxState: true
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(event) {
    this.setState({checkboxState: !this.state.checkboxState});

    if (!this.state.checkboxState) {
      Video.show();
    } else {
      Video.hide();
    }
  }

  render() {
    return <div id="videoButton"><input type="checkbox" onClick={this.toggle} defaultChecked /><label><TranslatableText dictionary={showVideoButtonText} /></label></div>;
  }
}

export function Settings({ tiers, hasVideo }) {
	// I/P: tiers, a hashmap from tier name to a boolean indicating whether the tier is subdivided
	//      hasVideo, a boolean
	// O/P: checkboxes that show/hide tiers and the video when clicked
  let videoButton = null;
  if (hasVideo) {
    videoButton = <VideoButton />;
  }

	return (
		<div id="settings" className="miniPage">
			<TierCheckboxList tiers={tiers} />
			{videoButton}
		</div>
	);
}
