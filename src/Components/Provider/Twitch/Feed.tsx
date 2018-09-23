import './Feed.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as Twitch from '../../../Providers/Twitch';
import * as Utils from '../../../Utils';
import { statelessComponent } from '../../HOC/Stateless';
import { Item } from './Item';

const CLIENT_ID = '82aaq2cdcyd7e4bj7lyba7ecly34we';

export interface FeedProps {
  id: string;
  feed: Twitch.Feed;
  setFeed(id: string, feed: Twitch.Feed): void;
}

const ConnectedList = statelessComponent<FeedProps>(
  {},
  {
    componentWillMount({ id, setFeed }: FeedProps) {
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
              link: featured.stream._links.self
            };
          });
          setFeed(id, { status: 'loaded', items: items });
        })
        .catch(error => {
          setFeed(id, { status: 'error', error: error, items: [] });
        });
    }
  })(({ feed }) => {
    const items = () => {
      if (feed.status === 'loading') {
        return (
          <div>Loading...</div>
        );
      }
      return feed.items.map((item, id) => (
        <Item {...{ id, item }} />
      ));
    };
    return (
      <div className='twitch-feed' >
        {items()}
      </div>
    );
  });

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setFeed: (id: string, feed: Twitch.Feed) => dispatch(Twitch.setFeed(id, feed)),
});

export const Feed = connect(undefined, mapDispatchToProps)(ConnectedList);
