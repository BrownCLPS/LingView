// Based on http://community.village.virginia.edu/etst/

export function setupTextSync() {

    // "media" is undefined if there are no AV files associated with the current text. 
    const media = document.querySelectorAll("[data-live='true']")[0];
    let ts_tag_array = []; // Array that stores all timestamps/sentence id
    let ts_start_time_array = [];
    let ts_stop_time_array = [];

    if (media) {
        // For files with AV files, link the media file with the syncing functions.
        media.setAttribute("ontimeupdate", "sync(this.currentTime)");
        media.setAttribute("onclick", "sync(this.currentTime)");
        // For each sentence, sets up the sentence's start and end time. 
        ts_tag_array = document.getElementsByClassName("labeledTimeBlock");
        for (var i = 0; i < ts_tag_array.length; i++) {
            ts_start_time_array[i] = ts_tag_array[i].getAttribute("data-start_time");
            ts_stop_time_array[i] = ts_tag_array[i].getAttribute("data-end_time");
        }
    } else {
        ts_tag_array = document.getElementsByClassName("untimedBlock");
    }

    /* Scrolls to a selected sentence. */
    function scrollIntoViewIfNeeded(target) {
        var rect = target.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
            target.scrollIntoView(false);
        }
        if (rect.top < 0) {
            target.scrollIntoView();
        } 
    }

    /* Sync function for files with AV */
    window.sync = function sync(current_time) {
        for (var i=0; i<ts_tag_array.length; i++) {
            // Somewhat hacky solution: decrease current_time by 0.001 to avoid highlighting before player starts
            if ((current_time-0.001 >= parseFloat(ts_start_time_array[i])/1000.0) && (current_time <= parseFloat(ts_stop_time_array[i])/1000.0)) {
                ts_tag_array[i].setAttribute("id", "current");
                scrollIntoViewIfNeeded($("#current")[0]);
                highlightSentence(i); 
            }
            else {
                unHighlightSentence(i);
                try { ts_tag_array[i].removeAttribute("id"); }
                catch (err) { }
            }
        }
    }

    /* Two functions that highlights/unhighlights a sentence. */
    function highlightSentence(timestampIndex) {
        ts_tag_array[timestampIndex].style.backgroundColor = "rgb(209, 200, 225)";
    }
    function unHighlightSentence(timestampIndex) {
        ts_tag_array[timestampIndex].style.backgroundColor = "transparent";
    }

    /* OnClick function for each timestamp */
    $(".timeStamp").click(function() {
        const newTime = $(this).data('start_time');
        if (newTime) {
            updateTimestampQuery(newTime);
            setMediaCurrentTime(newTime);
        } else {
            // A file without AV files will not have newTime associated with each sentence.
            // In this case, use the sentence id as part of the new URL after selecting a sentence. 
            const sentId = $(this).data('sentence_id');
            updateForUntimedFile(sentId);
        }
    });

    /* For files without AV, change the selected sentence's color and update query URL. */
    function updateForUntimedFile(sentId) {
        for (var i = 0; i < ts_tag_array.length; i++) {
            // sentence id starts with 1
            if (i+1 == sentId) {
                highlightSentence(i);
            } else {
                unHighlightSentence(i);
            }
        }
        updateTimestampQuery(sentId);
    }

    // I/P: t, an integer number of milliseconds
    // O/P: the player updates to the given time
    // Status: untested
    // This function adjusts the AV file(s)' timestamp according to the 
    // selected sentence's URL
    function setMediaCurrentTime(t) {
        const media = $("[data-live='true']").get(0);
        if (media) {
            media.currentTime = (t + 2) / 1000;
        }
    }

    /* Updates the URL according to a sentence's index id. */
    function updateTimestampQuery(newSentenceIndex) {
        if (window.history.replaceState) {
            // For files with AV, the intended behavior on the site is that
            // the first sentence doesn't highlight until things actually start playing.
            // That way, the first sentence becomes highlighted 1 ms into the recording if its start time was 0 ms.
            // So, here if media files are present, decrement sentence index by 1.
            if (media) {
                newSentenceIndex -= 1;
            }
            const newurl = window.location.href.replace(/\?.*$/,'') + `?${newSentenceIndex}`; // hacky...
            window.history.replaceState({ path: newurl }, '', newurl);
        }
    }


    /* 
     * Reads the page's current URL, and if the sentence query index is specified, 
     * performs the corresponding functions to jump to the requested sentence. 
     */
    // Source: http://snydersoft.com/blog/2009/11/14/get-parameters-to-html-page-with-javascript/
    $( document ).ready(function() {
        // This sentenceTimestampId is the timestamp for a file with AV, 
        // and a sentence id for a file without AV. 
        let query_index = document.URL.indexOf("?");
        let sentenceTimestampId = Number(document.URL.substr(query_index+1));
        if (isFinite(sentenceTimestampId)) {
            if (media) {
                setMediaCurrentTime(sentenceTimestampId + 1);
            } else {
                updateForUntimedFile(sentenceTimestampId);
                ts_tag_array[sentenceTimestampId].setAttribute("id", "current");
                scrollIntoViewIfNeeded($("#current")[0]);
            } 
        }
    });
  
}
