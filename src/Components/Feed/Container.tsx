import './Container.css';

import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';

import * as Twitch from '../../Providers/Twitch';
import { State } from '../../Store';
import { statelessComponent } from '../HOC/Stateless';
import { Feed, FeedProps } from '../Provider/Twitch/Feed';

export interface ContainerProps {
  feeds: Immutable.Map<string, Twitch.Feed>;
}

const ConnectedContainer = statelessComponent<ContainerProps>(

)(({ feeds }) => {
  return (
    <div className='streams-container'>
      {Object.entries(feeds.toJS()).map(([id, feed]) => (
        <div key={id}>
          <Feed {...{ id, feed } as FeedProps} />
        </div>
      ))}
    </div>
  );
});

const mapStateToProps = (state: State) => {
  return { feeds: state.get('twitch') };
};

export const Container = connect(mapStateToProps)(ConnectedContainer);
