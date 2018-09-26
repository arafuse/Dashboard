import './Feed.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as Twitch from '../../../Reducers/Provider/Twitch';
import * as Config from '../../../Reducers/Config';
import * as Utils from '../../../Utils';
import { statelessComponent } from '../../HOC/Stateless';
import { Item } from './Item';

const CLIENT_ID = '82aaq2cdcyd7e4bj7lyba7ecly34we';

export interface FeedProps {
  id: string;
  feed: Twitch.Feed;
  self: React.Component<FeedProps>;
  options: Config.Options;
  setFeed(id: string, feed: Twitch.Feed): void;
  deleteFeed(id: string): void;
  concatFeed(id: string, feed: Twitch.Feed): void;
  toggleOptions(id: string): void;
  setScrollHandler(): (node: HTMLDivElement) => void;
  handleDeleteFeed(): (props: FeedProps) => void;
  handleToggleOptions(): (props: FeedProps) => void;
}

const refreshFeed = (props: FeedProps) => {
  const { id, setFeed } = props;
  setFeed(id, { status: 'loading', items: [] });
  fetch('https://api.twitch.tv/kraken/streams/featured?client_id=' + CLIENT_ID)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const items = data.featured.map((featured: any) => {
        return {
          title: featured.title,
          badge: featured.stream.channel.logo,
          channel: featured.stream.channel.display_name,
          content: Utils.textFromHTML(featured.text),
          image: featured.stream.preview.medium,
          link: featured.stream.channel.url,
        };
      });
      const feed = { status: 'loaded', next: data._links.next, items: items };
      setFeed(id, feed);
    })
    .catch(error => {
      setFeed(id, { status: 'error', error: error, items: [] });
    });
};

const appendFeed = ({ self, id, concatFeed, setFeed }: FeedProps) => {
  self.props.feed.next && fetch(self.props.feed.next + '&client_id=' + CLIENT_ID)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (!data.featured) return;
      const items = data.featured.map((featured: any) => {
        return {
          title: featured.title,
          badge: featured.stream.channel.logo,
          channel: featured.stream.channel.display_name,
          content: Utils.textFromHTML(featured.text),
          image: featured.stream.preview.medium,
          link: featured.stream.channel.url,
        };
      });
      const feed = { status: 'loaded', next: data._links.next, items: items };
      concatFeed(id, feed);
    })
    .catch(error => {
      console.error(error);
      setFeed(id, { status: 'error', error: error, items: [] });
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
    }
  },
  {
    componentDidMount: (props: FeedProps) => {
      refreshFeed(props);
    }
  })(({ feed, options, setScrollHandler, handleDeleteFeed, handleToggleOptions }) => {
    const items = () => {
      if (feed.status === 'loading') {
        return (
          <div>Loading...</div>
        );
      }
      return feed.items.map((item, id) => (
        <div key={id}>
          <Item {...{ item }} />
        </div>
      ));
    };
    return (
      <div ref={setScrollHandler} className='twitch-feed' style={{width: options.width}} >
        <div className='twitch-feed__menu'>
          <i className='icon fa fa-trash fa-lg' onClick={handleDeleteFeed}></i>
          <i className='icon fa fa-cog fa-lg' onClick={handleToggleOptions}></i>
        </div>
        {items()}
      </div>
    );
  });

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setFeed: (id: string, feed: Twitch.Feed) => dispatch(Twitch.setFeed(id, feed)),
  concatFeed: (id: string, feed: Twitch.Feed) => dispatch(Twitch.concatFeed(id, feed)),
  deleteFeed: (id: string) => {
    dispatch(Twitch.deleteFeed(id));
    dispatch(Config.deleteOptions(id));
  },
  toggleOptions: (id: string) => dispatch(Config.toggleOptions(id))
});

export const Feed = connect(undefined, mapDispatchToProps)(ConnectedFeed);
