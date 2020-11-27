export class Video extends React.Component {
	// I/P: path, the path to the video
	// O/P: a video player
	// Status: re-written, untested
	render() {
		return <video src={this.props.path} id="video" controls controlsList="nodownload" />;
	}

	static show() {
		// Resize panels:
		var extraHeight = 88; // NavBar plus footer.
		var bodyHeight = 'calc(100% - ' + extraHeight.toString() + "px)";

		$('#leftPanel').css('width', '40%');
		$('#leftPanel').css('height', bodyHeight);
		$('#centerPanel').css('margin-left', '40%');
		$('#centerPanel').css('height', bodyHeight);
		$("#centerPanel").css("width", "60%");

		// Deactivate audio:
		$('#footer').css('display', 'none');
		$('#audio').removeAttr('ontimeupdate');
		$('#audio').removeAttr('onclick');
		$('#audio').attr('data-live', 'false');

		// Activate video:
		$('#video').css('display', 'block'); // switched from 'inline' because it seemed unnecessary and allowed for flickering scrollbar glitch
		$('#video').attr('data-live', 'true');
		$('#video').attr('ontimeupdate', 'sync(this.currentTime)');
		$('#video').attr('onclick', 'sync(this.currentTime)');

		// Match times:
		var audio = document.getElementById('audio');
		var video = document.getElementById('video');

		if (!audio.paused) {
			audio.pause();
			video.play();
		}

		video.currentTime = audio.currentTime;
	}

	static hide() {
		// Resize panels:
		var extraHeight = 128; // NavBar plus footer plus audio.
		var bodyHeight = 'calc(100% - ' + extraHeight.toString() + "px)";

		$("#leftPanel").css("width", "300px");
		$("#leftPanel").css("height", bodyHeight);
		$("#centerPanel").css("height", bodyHeight);
		$("#centerPanel").css("margin-left", "300px");
		$("#centerPanel").css("width", "calc(100% - 300px)");

		// Deactivate video:
		$("#video").css("display", "none");
		$("#video").removeAttr("onclick");
		$("#video").removeAttr("ontimeupdate");
		$("#video").attr("data-live", "false");

		// Activate audio:
		$("#footer").css("display", "block");
		$("#audio").attr("data-live", "true");
		$("#audio").attr("ontimeupdate", "sync(this.currentTime)");
		$("#audio").attr("onclick", "sync(this.currentTime)");

		// Match times:
		var audio = document.getElementById("audio");
		var video = document.getElementById("video");
		if (!video.paused) {
			video.pause();
			audio.play();
		}
		audio.currentTime = video.currentTime;
	}
}
