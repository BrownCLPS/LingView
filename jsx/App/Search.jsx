import React from 'react';
import Fuse from 'fuse.js';
import { SearchSentence } from './Stories/Story/Display/Sentence.jsx';
import * as Languages from './LanguageConstants.jsx';
var htmlEscape = require('ent/encode');
var decode = require('ent/decode');
// Note: tier names should be escaped when used as HTML attributes (e.g. data-tier=tier_name),
// but not when used as page text (e.g. <label>{tier_name}</label>)

const searchPrompt = {
  [Languages.ENGLISH] : "Search database:",
  [Languages.ESPANOL] : "Buscar en la base de datos:",
  [Languages.FRANCAIS] : "Rechercher dans la base de données:",
};

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { searchResults: [], searchIndex: null };
        console.log(this.props);
        this.runSearch = this.throttle(this.search, 300, this);
    }

    componentDidMount() {
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
            if (e.checked) fields.push(decode(`dependents.${e.id}.value`));
        });
        console.log(fields);

        var options = {
            isCaseSensitive: false,
            shouldSort: true, // sort by relevance
            findAllMatches: true, // not just the first match in each tier
            ignoreLocation: true, // the match can be anywhere within the tier
            ignoreFieldNorm: true, // equal relevance for matches in long vs short strings
            threshold: 0.2, // 0.0 means perfect matches only, 1.0 matches anything
            keys: fields
        };

        console.log("running search over: " + fields);
        return new Fuse(this.state.searchIndex.sentences, options)
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

        console.log("Search results:");
        console.log(searchResult);
        let searchResults = [];
        for (var i = 0, j = searchResult.length; i < j; i++) {
            if ('speaker' in searchResult[i]) {
                let component = (<SearchSentence sentence={searchResult[i].item} true />);
                searchResults.push(component);
            } else {
                let component = (<SearchSentence sentence={searchResult[i].item} false />);
                searchResults.push(component);
            }
        }
        this.setState({ "searchResults": searchResults });
    }

    handleInputChange() {
        this.runSearch(false);
    }

    genCheckboxes () { // called by render()
        let checkboxes = [];
        let tiers = this.state.searchIndex['tier IDs'];
        console.log(tiers);
        tiers.forEach((tier) => {
            checkboxes.push(
                <input id={htmlEscape(tier)} name="fields" type="checkbox" onChange={this.search.bind(this)}
                defaultChecked />
            );
            checkboxes.push(<label>{tier}</label>);
            checkboxes.push(<span>&nbsp;&nbsp;</span>);
        })
        console.log(checkboxes);
        return checkboxes
    }

    render() {
        if (!this.state.searchIndex) return <div className="loader">Loading Search...</div>; // (could use a dedicated loader component instead)

        let results = this.state.searchResults;
        console.log("rendering...");
        return (
            <div id="searchForm">
                <label for="searchInput">{searchPrompt[this.props.lang]}</label> <input id="searchInput" onChange={this.handleInputChange.bind(this)} type="text" />
                <br />
                {this.genCheckboxes()}
                <br />
                <div id="searchResults">{results}</div>
            </div>
        )
    };
}
