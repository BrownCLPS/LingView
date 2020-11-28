import React from 'react';
import id from 'shortid';
import { Route, Switch } from 'react-router-dom';
import { Story } from './Story/Story.jsx';
import { NotFound } from './NotFound.jsx';
import { Loader } from './Loader.jsx';

export class Stories extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index: null };
  }
  componentDidMount() {
    import('~./data/index.json').then(i => {
      console.log(i);
      this.setState({ index: i.default })
    });
  }

  render() {
    if (!this.state.index) return <Loader />;

    return (
        <Switch>
          {
            this.state.index && Object.values(this.state.index).map(story => (
                <Route
                    key={id.generate()}
                    exact path={`/story/${story['story ID']}`}
                    render={props => <Story storyID={story['story ID']} />}
                />
            ))
          }
          <Route component={NotFound} />
        </Switch>
    );
  }
}
