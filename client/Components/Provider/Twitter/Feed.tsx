import './Feed.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
//import { TweetStream } from 'scrape-twitter';

import * as Config from '../../../Reducers/Config';
import * as Twitter from '../../../Reducers/Provider/Twitter';
import { Options, OptionsProps } from './Options';
import { statelessComponent } from '../../HOC/Stateless';
import { Item, ItemProps } from './Item';

//const ITEMS_PER_PAGE = 10;

export interface FeedProps {
  id: string;
  feed: Twitter.Feed;
  options: Config.Options;
  setFeed(id: string, feed: Twitter.FeedParams): void;
  deleteFeed(id: string): void;
  concatFeed(id: string, feed: Twitter.FeedParams): void;
  setItem(id: string, item: Twitter.SetItemParams): void;
  toggleOptions(id: string): void;
  setScrollHandler(): (node: HTMLDivElement) => void;
  handleDeleteFeed(): (props: FeedProps) => void;
  handleToggleOptions(): (props: FeedProps) => void;
  handleRefresh(): (props: FeedProps) => void;
}

const appendFeed = (props: FeedProps) => {

  console.log('Append feed');
}

const ConnectedFeed = statelessComponent<FeedProps>(
  {
    setScrollHandler: (node: HTMLElement) => (props: FeedProps) => {
      node && node.addEventListener('scroll', () => {
        const contentHeight = node.scrollHeight - node.offsetHeight;
        if (contentHeight <= node.scrollTop) appendFeed(props);
      });
    },

    handleDeleteFeed: () => ({ id, deleteFeed }: FeedProps) => {
      deleteFeed(id);
    },

    handleToggleOptions: () => ({ id, toggleOptions }: FeedProps) => {
      toggleOptions(id);
    },

    handleRefresh: () => (props: FeedProps) => {
      const { id, setFeed } = props;
      setFeed(id, { ...Twitter.emptyFeed, status: 'loading' });
      appendFeed(props);
    },
  },
  {
    componentDidMount: (props: FeedProps) => {
      const { id, setFeed, toggleOptions } = props;
      setFeed(id, { ...Twitter.emptyFeed, status: 'loading' });
      toggleOptions(id);
      appendFeed(props);
    }
  }
)(({ id, feed, options, setScrollHandler, handleDeleteFeed, handleToggleOptions, handleRefresh }) => {
  const items = () => {
    if (feed.status === 'loading') {
      return (
        <div>Loading...</div>
      );
    }
    // https://github.com/facebook/immutable-js/issues/1430
    const nodes: Array<React.ReactNode> = [];
    feed.items.map((item, id) =>
      nodes.push(
        <div key={id}>
          <Item {...{ item } as ItemProps} />
        </div>
      )
    );
    return nodes;
  };
  return (
    <div ref={setScrollHandler} className='twitter-feed' style={{ width: options.width }} >
      <Options {...{ id, options } as OptionsProps} />
      <div className='twitter-feed__menu'>
        <i className='icon fa fa-trash fa-lg' onClick={handleDeleteFeed}></i>
        <i className='icon fa fa-cog fa-lg' onClick={handleToggleOptions}></i>
        <i className='icon fa fa-refresh fa-lg' onClick={handleRefresh} ></i>
      </div>
      {items()}
    </div>
  );
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  toggleOptions: (id: string) => dispatch(Config.toggleOptions(id)),
  setFeed: (id: string, feed: Twitter.FeedParams) => dispatch(Twitter.setFeed(id, feed)),
  concatFeed: (id: string, feed: Twitter.FeedParams) => dispatch(Twitter.concatFeed(id, feed)),
  deleteFeed: (id: string) => { dispatch(Twitter.deleteFeed(id)); dispatch(Config.deleteOptions(id)); },
  setItem: (id: string, item: Twitter.SetItemParams) => dispatch(Twitter.setItem(id, item))
});

export const Feed = connect(undefined, mapDispatchToProps)(ConnectedFeed);
