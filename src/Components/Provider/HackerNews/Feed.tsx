
import './Feed.css';

import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as HackerNews from '../../../Reducers/Provider/HackerNews';
import * as Config from '../../../Reducers/Config';
// import * as Utils from '../../../Utils';
import { statelessComponent } from '../../HOC/Stateless';
import { Item, ItemProps } from './Item';

const NEW_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/newstories.json';
//const ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item/${id}.json';
const ITEMS_PER_PAGE = 25;

export interface FeedProps {
  id: string;
  feed: HackerNews.Feed;
  options: Config.Options;
  setFeed(id: string, feed: HackerNews.FeedUpdate): void;
  deleteFeed(id: string): void;
  concatFeed(id: string, feed: HackerNews.FeedUpdate): void;
  toggleOptions(id: string): void;
  setScrollHandler(): (node: HTMLDivElement) => void;
  handleDeleteFeed(): (props: FeedProps) => void;
  handleToggleOptions(): (props: FeedProps) => void;
  handleRefresh(): (props: FeedProps) => void;
}

const appendFeed = (props: FeedProps) => {
  const { feed } = props;
  if (!feed.stories.length) {
    fetch(NEW_STORIES_URL).then(response => response.json()).then(stories => {      
      appendStories(props, stories);
    });
  }
  else {
    appendStories(props, feed.stories)
  };
};

const appendStories = ({ id, feed, concatFeed, setFeed }: FeedProps, stories: Array<number>) => {  
  console.log(stories);  
  const items = stories.slice(feed.items.size, feed.items.size + ITEMS_PER_PAGE).map((story: number) => ({
    title: 'Test story' + story,
    badge: 'https://cdn.iconscout.com/icon/free/png-512/hacker-news-2-569388.png',
    content: 'Lorem ipsum dolor sit amet.',
    image: 'https://cdn.britannica.com/55/174255-004-9A4971E9.jpg',
    link: 'https://en.wikipedia.org/wiki/Fake_news'
  }));  
  concatFeed(id, { status: 'loaded', items: Immutable.List(items), stories: stories });
};

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
      setFeed(id, { status: 'loading', items: Immutable.List(), stories: [] });
      appendFeed(props);
    },
  },
  {
    componentDidMount: (props: FeedProps) => {
      props.setFeed(props.id, { status: 'loading', items: Immutable.List(), stories: [] });
      appendFeed(props);
    }
  }
)(({ feed, options, setScrollHandler, handleDeleteFeed, handleToggleOptions, handleRefresh }) => {
  const items = () => {
    if (feed.status === 'loading') {
      return (
        <div>Loading...</div>
      );
    }
    return feed.items.map((item, id) => (
      <div key={id}>
        <Item {...{ item } as ItemProps} />
      </div>
    ));
  };
  return (
    <div ref={setScrollHandler} className='hn-feed' style={{ width: options.width }} >
      <div className='hn-feed__menu'>
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
  setFeed: (id: string, feed: HackerNews.Feed) => dispatch(HackerNews.setFeed(id, feed)),
  concatFeed: (id: string, feed: HackerNews.Feed) => dispatch(HackerNews.concatFeed(id, feed)),
  deleteFeed: (id: string) => {
    dispatch(HackerNews.deleteFeed(id));
    dispatch(Config.deleteOptions(id));
  }
});

export const Feed = connect(undefined, mapDispatchToProps)(ConnectedFeed);
