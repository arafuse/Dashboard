import './Feed.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as Config from '../../../Reducers/Config';
import * as Twitch from '../../../Reducers/Provider/Twitch';
import * as Utils from '../../../Utils';
import { statelessComponent } from '../../HOC/Stateless';
import { Item, ItemProps } from './Item';
import { Options, OptionsProps } from './Options';

const ITEMS_PER_PAGE = 10;
const FEATURED_URL = `https://api.twitch.tv/kraken/streams/featured?limit=${ITEMS_PER_PAGE}&client_id=`;
const STREAMS_URL = `https://api.twitch.tv/kraken/streams/?limit=${ITEMS_PER_PAGE}&client_id=`;

export interface FeedProps {
  id: string;
  feed: Twitch.Feed;
  self: React.Component<FeedProps>;
  options: Config.Options;
  setFeed(id: string, feed: Twitch.FeedParams): void;
  deleteFeed(id: string): void;
  concatFeed(id: string, feed: Twitch.FeedParams): void;
  toggleOptions(id: string): void;
  setScrollHandler(): (node: HTMLDivElement) => void;
  handleDeleteFeed(): (props: FeedProps) => void;
  handleToggleOptions(): (props: FeedProps) => void;
  handleRefresh(props: FeedProps): () => void;
}

const appendFeed = ({ id, feed, options, concatFeed, setFeed }: FeedProps) => {
  const startUrl = options.source === 'featured' ? FEATURED_URL : STREAMS_URL;
  const url = feed.next ? feed.next + '&client_id=' : startUrl;
  const urlEncoded = encodeURIComponent(Buffer.from(url).toString('base64'));
  console.log(feed);
  fetch('/twitch/sign/' + urlEncoded).then(response => response.json()).then(data => {
    let items;
    if (options.source === 'featured') {
      if (!data.featured) return;
      items = data.featured.map((featured: any) => ({
        title: featured.title,
        badge: featured.stream.channel.logo,
        channel: featured.stream.channel.display_name,
        content: Utils.textFromHTML(featured.text),
        image: featured.stream.preview.large,
        link: featured.stream.channel.url
      }));
    } else {
      if (!data.streams) return;
      items = data.streams.map((stream: any) => ({
        title: '',
        badge: stream.channel.logo,
        channel: stream.channel.display_name,
        content: '',
        image: stream.preview.large,
        link: stream.channel.url
      }));
    }
    concatFeed(id, { status: 'loaded', next: data._links.next, items: items });
  }).catch(error => {
    console.error(error);
    setFeed(id, { ...feed, status: 'error', error: error });
  });
};

const ConnectedFeed = statelessComponent<FeedProps>(
  {
    setScrollHandler: (node: HTMLElement) => ({ self }: FeedProps) => {
      node && node.addEventListener('scroll', () => {
        const contentHeight = node.scrollHeight - node.offsetHeight;
        if (contentHeight <= node.scrollTop) appendFeed(self.props);
      });
    },

    handleDeleteFeed: () => ({ id, deleteFeed }: FeedProps) => {
      deleteFeed(id);
    },

    handleToggleOptions: () => ({ id, toggleOptions }: FeedProps) => {
      toggleOptions(id);
    },

    handleRefresh: (props: FeedProps) => () => () => {
      const { id, setFeed } = props;
      setFeed(id, { ...Twitch.emptyFeed, status: 'loading' });
      appendFeed({ ...props, feed: { ...Twitch.emptyFeed, status: 'loading' } } as FeedProps);
    },
  },
  {
    componentDidMount: (props: FeedProps) => () => {
      const { id, setFeed } = props;
      setFeed(id, { ...Twitch.emptyFeed, status: 'loading' });
      appendFeed({ ...props, feed: { ...props.feed, status: 'loading' } });
    }
  }
)((props) => {
  const { feed, options, setScrollHandler, handleDeleteFeed, handleToggleOptions, handleRefresh } = props;
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
    <div ref={setScrollHandler} className='twitch-feed' style={{ width: options.width }} >
      <Options {...{ appendFeed, feedProps: props } as OptionsProps} />
      <div className='twitch-feed__menu'>
        <i className='icon fa fa-trash fa-lg' onClick={handleDeleteFeed}></i>
        <i className='icon fa fa-cog fa-lg' onClick={handleToggleOptions}></i>
        <i className='icon fa fa-refresh fa-lg' onClick={handleRefresh(props)} ></i>
      </div>
      {items()}
    </div>
  );
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  toggleOptions: (id: string) => dispatch(Config.toggleOptions(id)),
  setFeed: (id: string, feed: Twitch.Feed) => dispatch(Twitch.setFeed(id, feed)),
  concatFeed: (id: string, feed: Twitch.Feed) => dispatch(Twitch.concatFeed(id, feed)),
  deleteFeed: (id: string) => { dispatch(Twitch.deleteFeed(id)); dispatch(Config.deleteOptions(id)); }
});

export const Feed = connect(undefined, mapDispatchToProps)(ConnectedFeed);
