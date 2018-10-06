
import './Feed.css';

import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { getMetadata } from 'page-metadata-parser';

import * as HackerNews from '../../../Reducers/Provider/HackerNews';
import * as Config from '../../../Reducers/Config';
import { statelessComponent } from '../../HOC/Stateless';
import { Item, ItemProps } from './Item';
import * as format from 'string-format';

const ITEMS_PER_PAGE = 10;
const NEW_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/newstories.json';
const ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item/{}.json';

export interface FeedProps {
  id: string;
  feed: HackerNews.Feed;
  self: React.Component<FeedProps>;
  options: Config.Options;
  setFeed(id: string, feed: HackerNews.FeedParams): void;
  deleteFeed(id: string): void;
  concatFeed(id: string, feed: HackerNews.FeedParams): void;
  setItem(id: string, item: HackerNews.SetItemParams): void;
  toggleOptions(id: string): void;
  setScrollHandler(): (node: HTMLDivElement) => void;
  handleDeleteFeed(): (props: FeedProps) => void;
  handleToggleOptions(): (props: FeedProps) => void;
  handleRefresh(): (props: FeedProps) => void;  
}

const appendFeed = (props: FeedProps) => {
  const { feed } = props;
  if (!feed.storyIds.length) {
    fetch(NEW_STORIES_URL).then(response => response.json()).then(stories => {
      appendStories(props, stories);
    });
  }
  else {
    appendStories(props, feed.storyIds);
  }
};

const appendStories = ({ self, id, feed, concatFeed, setItem }: FeedProps, storyIds: Array<string>) => {
  const length = self.props.feed.items.size;
  const items = Immutable.OrderedMap<string, HackerNews.Item>().withMutations((newItems) => {
    storyIds.slice(length, length + ITEMS_PER_PAGE).forEach((storyId: string) =>
      newItems.set(storyId, HackerNews.ItemRecord({
        title: 'Test'
      }) as HackerNews.Item));
  });
  concatFeed(id, { status: 'loaded', items, storyIds });
  items.forEach((_, itemId) => {
    fetch(format(ITEM_URL, itemId as string)).then(response => response.json()).then(story => {
      const discussion = 'https://news.ycombinator.com/item?id=' + itemId
      const link = story.url || discussion
      setItem(id, { 
        id: itemId as string,
        item: { 
          title: story.title, 
          user: story.by,
          link: link, 
          discussion: discussion,
          badge: 'https://news.ycombinator.com/favicon.ico'
        }
      });
      if (!story.url) return;
      const urlEncoded = encodeURIComponent(Buffer.from(story.url).toString('base64'));
      fetch('/fetch/' + urlEncoded).then(response => response.text()).then(html =>{                
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const metadata = getMetadata(doc, story.url);
        const icon = metadata.icon || 'https://news.ycombinator.com/favicon.ico'
        setItem(id, { 
          id: itemId as string,
          item: { content: metadata.description, image: metadata.image, badge: icon }
        });      
      });      
    });
  });
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
      setFeed(id, { status: 'loading', items: Immutable.OrderedMap(), storyIds: [] });
      appendFeed(props);
    },
  },
  {
    componentDidMount: (props: FeedProps) => {
      props.setFeed(props.id, { status: 'loading', items: Immutable.OrderedMap(), storyIds: [] });
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
  setFeed: (id: string, feed: HackerNews.FeedParams) => dispatch(HackerNews.setFeed(id, feed)),
  concatFeed: (id: string, feed: HackerNews.FeedParams) => dispatch(HackerNews.concatFeed(id, feed)),
  deleteFeed: (id: string) => { dispatch(HackerNews.deleteFeed(id)); dispatch(Config.deleteOptions(id));},
  setItem: (id: string, item: HackerNews.SetItemParams) => dispatch(HackerNews.setItem(id, item))
});

export const Feed = connect(undefined, mapDispatchToProps)(ConnectedFeed);
