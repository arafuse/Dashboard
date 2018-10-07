import './Feed.css';

import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';

import * as Config from '../../../Reducers/Config';
import * as Twitter from '../../../Reducers/Provider/Twitter';
import { Options, OptionsProps } from './Options';
import { statelessComponent } from '../../HOC/Stateless';
import { Item, ItemProps } from './Item';

const ITEMS_PER_PAGE = 10;
const MAX_ITEMS= 100;

export interface FeedProps {
  id: string;
  feed: Twitter.Feed;
  self: React.Component<FeedProps>;
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

const appendFeed = (props: FeedProps, stream: Array<any> | null) => {  
  const {options} = props;  
  if (!stream && options.query) {
    const queryEncoded = Buffer.from(options.query).toString('base64');
    fetch(`/twitter/scrape/${queryEncoded}/${MAX_ITEMS}`).then(response => response.json()).then(newStream => {                  
      appendTweets(props, newStream);      
    });
  } else {        
    appendTweets(props, stream || []);
  }
};

const appendTweets = ({id, feed, concatFeed}: FeedProps, stream: Array<any>) => {
  const length = feed.items.size;  
  const items = Immutable.OrderedMap<string, Twitter.Item>().withMutations((newItems) => {    
    stream.slice(length, length + ITEMS_PER_PAGE).forEach((tweet: any) =>       
      newItems.set(uuidv4(), Twitter.ItemRecord({
        user: tweet.screenName,
        content: tweet.text
      }) as Twitter.Item));
  });
  concatFeed(id, { status: 'loaded', items, stream});
};

const ConnectedFeed = statelessComponent<FeedProps>(
  {
    setScrollHandler: (node: HTMLElement) => ({self}: FeedProps) => {
      node && node.addEventListener('scroll', () => {
        const contentHeight = node.scrollHeight - node.offsetHeight;
        if (contentHeight <= node.scrollTop) {          
          appendFeed(self.props, self.props.feed.stream);
        }
      });
    },

    handleDeleteFeed: () => ({ id, deleteFeed }: FeedProps) => {
      deleteFeed(id);
    },

    handleToggleOptions: () => ({ id, toggleOptions }: FeedProps) => {
      toggleOptions(id);
    },

    handleRefresh: () => ({self}: FeedProps) => {
      const { id, setFeed } = self.props;
      setFeed(id, { ...Twitter.emptyFeed, status: 'loading', stream: null});
      appendFeed(self.props, null);
    },
  },
  {
    componentDidMount: (props: FeedProps) => {
      const { id, setFeed, toggleOptions } = props;
      setFeed(id, { ...Twitter.emptyFeed, status: 'loading' });
      toggleOptions(id);      
    },
  }
)(({ id, feed, options, setScrollHandler, handleDeleteFeed, handleToggleOptions, handleRefresh }) => {
  const items = () => {
    if (feed.status === 'loading') {
      return options.query ? <div>Loading...</div> : <div>Enter search query.</div>;
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
