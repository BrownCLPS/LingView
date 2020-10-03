import React from 'react';
import Fuse from 'fuse.js';
import { SearchSentence } from './Stories/Story/Display/Sentence.jsx';

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { searchResults: [], storiesIndex: null, searchIndex: null };
        console.log(this.props);
        this.runSearch = this.throttle(this.search, 300, this);
    }

    componentDidMount() {
        import('~./data/index.json').then(i => {
            console.log(i);
            this.setState({ storiesIndex: i.default })
        });
        import('~./data/search_index.json').then(i => {
            console.log(i);
            this.setState({ searchIndex: i.default })
        });
    }

    throttle(fn, threshhold, scope) {
        /*
        Takes in a function, threshold, and scope and returns a new
        function which will apply fn, at max, once per threshold
        credit: https://remysharp.com/2010/07/21/throttling-function-calls
        */
        var deferTimer;
        return function () {
            var context = scope || this;

            var args = arguments;
            
            if (deferTimer) clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                return fn.apply(context, args);
            }, threshhold);
        };
    }

    build_fuse() {
        let fields = [];
        document.getElementsByName("fields").forEach(function (e) {
            // tier names in search_index must match checkbox names, it looks like?
            if (e.checked) fields.push(`dependents.${e.id}.value`);
        });
        console.log(fields);
        console.log(this.state.searchIndex);

        var options = {
            shouldSort: true,
            findAllMatches: true,
            tokenize: true, // not in the options documented at https://fusejs.io/api/options.html
            matchAllTokens: true,
            threshold: 15, // 0.0 means perfect match, 1.0 matches anything, default is 0.6
            distance: 0,
            maxPatternLength: 64, // not in the options documented at https://fusejs.io/api/options.html
            minMatchCharLength: 1,
            keys: fields
        };
        
        console.log("running search over: " + fields);
        return new Fuse(this.state.searchIndex, options)
    }

    search(rebuild=true) {
        if (rebuild || !this.fuse) this.fuse = this.build_fuse();
        let input = document.getElementById("searchInput");
        if (input) {
            var query = input.value;
        } else {
            return;
        }
        let searchResult = this.fuse.search(query).slice(0, 25);

        console.log("Search result:");
        console.log(searchResult);
        // const displayTable = document.getElementById("searchResults");
        // displayTable.innerHTML = ""; (DON'T DO THIS)
        let searchResults = [];
        for (var i = 0, j = searchResult.length; i < j; i++) {
            if ('speaker' in searchResult[i]) {
                let component = (<SearchSentence sentence={searchResult[i]} true />);
                searchResults.push(component);
            } else {
                let component = (<SearchSentence sentence={searchResult[i]} false />);
                searchResults.push(component);
            }
        }
        this.setState({ "searchResults": searchResults });
    }

    handleInputChange() {
        this.runSearch(false);
    }

    getTiers() {
        let tiers = new Set();
        for (const story of Object.values(this.state.storiesIndex)) {
            const tierIDs = story['tier IDs'];
            for (const id in tierIDs) {
                tiers.add(id);
            }
        }
        return tiers
    }

    genCheckboxes () { // called by render()
        let checkboxes = [];
        let tiers = this.getTiers();
        console.log(tiers);
        tiers.forEach((tier) => {
            checkboxes.push(<label>{tier}</label>);
            checkboxes.push(
                <input id={tier} name="fields" type="checkbox" onChange={this.search.bind(this)} 
                defaultChecked />
            );
            checkboxes.push(<span>&nbsp;&nbsp;</span>);
        })
        console.log(checkboxes);
        return checkboxes
    }

    render() {
        if (!this.state.storiesIndex || !this.state.searchIndex) return <div className="loader">Loading Search...</div>; // (could use a dedicated loader component instead)
        console.log("loaded"); // TEMP

        let results = this.state.searchResults;
        console.log("rendering...");
        return (
            <div id="searchForm">
                <label for="searchInput">Search database:</label> <input id="searchInput" onChange={this.handleInputChange.bind(this)} type="text" />
                <br />
                {this.genCheckboxes()}
                <br />
                <div id="searchResults">{results}</div>
            </div>
        )
    };
}
