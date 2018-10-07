import './Container.css';

import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';

import * as Config from '../../Reducers/Config';
import * as Twitch from '../../Reducers/Provider/Twitch';
import * as Twitter from '../../Reducers/Provider/Twitter';
import * as HackerNews from '../../Reducers/Provider/HackerNews';
import { State } from '../../Store';
import { statelessComponent } from '../HOC/Stateless';
import { Feed as TwitchFeed, FeedProps as TwitchFeedProps } from '../Provider/Twitch/Feed';
import { Feed as TwitterFeed, FeedProps as TwitterFeedProps } from '../Provider/Twitter/Feed';
import { Feed as HackerNewsFeed, FeedProps as HackerNewsFeedProps } from '../Provider/HackerNews/Feed';
import { Options, OptionsProps } from './Options';

export interface ContainerProps {
  configs: Immutable.Map<string, Config.Options>;
  twitchFeeds: Immutable.Map<string, Twitch.Feed>;
  twitterFeeds: Immutable.Map<string, Twitter.Feed>;
  hnFeeds: Immutable.Map<string, HackerNews.Feed>;
}

const ConnectedContainer = statelessComponent<ContainerProps>()
  (({ configs, twitchFeeds, twitterFeeds, hnFeeds }) => {
    // Mapping outside of JSX due to https://github.com/facebook/immutable-js/issues/1430
    const nodes: Array<React.ReactNode> = [];
    twitchFeeds.map((feed, id) => {
      const options = configs.get(id as string);
      nodes.push(
        <div key={id}>
          <Options {...{ id, options } as OptionsProps} />
          <TwitchFeed {...{ id, feed, options } as TwitchFeedProps} />
        </div>
      );
    });
    twitterFeeds.map((feed, id) => {
      const options = configs.get(id as string);
      nodes.push(
        <div key={id}>
          <Options {...{ id, options } as OptionsProps} />
          <TwitterFeed {...{ id, feed, options } as TwitterFeedProps} />
        </div>
      );
    });
    hnFeeds.map((feed, id) => {
      const options = configs.get(id as string);
      nodes.push(
        <div key={id}>
          <Options {...{ id, options } as OptionsProps} />
          <HackerNewsFeed {...{ id, feed, options } as HackerNewsFeedProps} />
        </div>
      );
    });
    return (
      <div className='streams-container'>
        {nodes}
      </div>
    );
  });

const mapStateToProps = (state: State) => {
  return {
    configs: state.get('config'),
    twitchFeeds: state.get('twitch'),
    twitterFeeds: state.get('twitter'),
    hnFeeds: state.get('hn')
  };
};

export const Container = connect(mapStateToProps)(ConnectedContainer);
