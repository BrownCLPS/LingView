import React from 'react';
// import id from 'shortid';
// import { Link } from 'react-router-dom';
// import ReactDOMServer from 'react-dom/server';
import { TranslatableText } from './locale/TranslatableText.jsx';
import { indexPageTitleHeaderText, indexPageAuthorHeaderText, indexPageMediaHeaderText } from './locale/LocaleConstants.jsx';

require('datatables.net-dt');
import 'datatables.net-dt/css/jquery.dataTables.css';

export class StoryIndex extends React.Component {

    async componentDidMount() {
        const index = (await import('~./data/index.json')).default;
        let storyList = [];
        for (const story in index) {
            if (index.hasOwnProperty(story)) {
                /////////
                // Title
                /////////
                let mainTitle = index[story]['title']['con-Latn-EC'];
                if (index[story]['title']['_default'] != '') {
                    mainTitle = index[story]['title']['_default'];
                }

                let timed = '';
                if (index[story]['timed']) {
                    if (index[story]['media']['audio'] != '') {
                        timed += '🎧 &nbsp;&nbsp;'
                    }
                    if (index[story]['media']['video'] != '') {
                        timed += '🎞 &nbsp;&nbsp;'
                    }
                } else {
                    timed = '✘';
                }
                // React Router link:
                const link = `<a href='#/story/${index[story]['story ID']}'>${mainTitle}</a>`;

                storyList.push([link, index[story]['author'], timed]);
            }
        }

        $(document).ready(function() {
            $('#indexTable').DataTable( {
                data: storyList,
                columns: [ {}, {}, {} ],
                scrollY: '75vh',
                scrollCollapse: true,
                paging: false
            });
        });
        $('#indexTable').addClass("stripe");
    }

    render() {
        return (
            <div id="index">
                <table id="indexTable">
                  <thead>
                    <tr>
                        <th><TranslatableText dictionary={indexPageTitleHeaderText} /></th>
                        <th><TranslatableText dictionary={indexPageAuthorHeaderText} /></th>
                        <th><TranslatableText dictionary={indexPageMediaHeaderText} /></th>
                    </tr>
                  </thead>
                </table>
            </div>
        );
    }
}
