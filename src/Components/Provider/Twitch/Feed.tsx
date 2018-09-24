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
  feedRef: React.RefObject<HTMLDivElement>;  
  setFeed(id: string, feed: Twitch.Feed): void;  
  concatFeed(id: string, items: Array<Twitch.Item>): void;  
  setScrollHandler() : (node: HTMLDivElement) => void;
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

/*
const setScrollHandler = (props: FeedProps) => {  
  const node = props.feedRef.current;
  console.log(node);
  node && node.addEventListener('scroll', () => {        
    const scrollTop = node.scrollTop;
    const scrollHeight = node.scrollHeight;
    const offsetHeight = node.offsetHeight;
    const contentHeight = scrollHeight - offsetHeight;        
    if (contentHeight <= scrollTop) {          
      appendFeed(props);      
    }
  });
};

/*
const appendFeed = (props: FeedProps) => {
  const { id, feed, setFeed } = props;  
  fetch(feed.next + '&client_id=' + CLIENT_ID)
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
      const newFeed = { status: 'loaded', next: data._links.next, items: feed.items.concat(items) };
      setFeed(id, newFeed);
      setScrollHandler({...props, feed: newFeed});
    })
    .catch(error => {
      setFeed(id, { status: 'error', error: error, items: [] });
    });
};
*/

const ConnectedList = statelessComponent<FeedProps>(
  {
    setScrollHandler: (node: HTMLElement) => (props: FeedProps) => {
      console.log(node);
      console.log(props);
    }
  },
  {
    componentDidMount: (props: FeedProps) => {
      refreshFeed(props);
    }
  })(({feed, setScrollHandler} ) => {        
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
      <div ref={setScrollHandler} className='twitch-feed' >
        {items()}
      </div>
    );
  });

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setFeed: (id: string, feed: Twitch.Feed) => dispatch(Twitch.setFeed(id, feed)),
  concatFeed: (id: string, items: Array<Twitch.Item>) => dispatch(Twitch.concatFeed(id, items)),
});

export const Feed = connect(undefined, mapDispatchToProps)(ConnectedList);
