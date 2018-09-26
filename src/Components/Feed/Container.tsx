import './Container.css';

import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';

import * as Config from '../../Reducers/Config';
import * as Twitch from '../../Reducers/Provider/Twitch';
import { State } from '../../Store';
import { statelessComponent } from '../HOC/Stateless';
import { Feed, FeedProps } from '../Provider/Twitch/Feed';
import { Options, OptionsProps } from './Options';

export interface ContainerProps {
  configs: Immutable.Map<string, Config.Options>;
  feeds: Immutable.Map<string, Twitch.Feed>;
}

const ConnectedContainer = statelessComponent<ContainerProps>()
  (({ configs, feeds }) => (
    <div className='streams-container'>
      {Object.entries(feeds.toJS()).map(([id, feed]) => {
        const options = configs.get(id);
        return (          
          <div key={id}>
            <Options {...{ id, options } as OptionsProps} />
            <Feed {...{ id, feed, options } as FeedProps} />
          </div>
        );
      })}
    </div>
  ));

const mapStateToProps = (state: State) => {
  return {
    configs: state.get('config'),
    feeds: state.get('twitch')
  };
};

export const Container = connect(mapStateToProps)(ConnectedContainer);
