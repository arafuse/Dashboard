import './List.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { setFeed } from '../../Actions';
import { Feed } from '../../Models';
import { Item } from './Item';
import { statelessComponent } from '../HOC/Stateless';
import * as Utils from '../../Utils';

export interface ListProps {
  id: string;
  feed: Feed;
  setFeed(id: string, feed: Feed): void;
}

const CLIENT_ID = '82aaq2cdcyd7e4bj7lyba7ecly34we';

const ConnectedList = statelessComponent<ListProps>(
  {},
  {
    componentWillMount({ id, setFeed }: ListProps) {
      setFeed(id, { status: 'loading', items: [] });
      fetch('https://api.twitch.tv/kraken/streams/featured?client_id=' + CLIENT_ID)
        .then(response => {
          return response.json();
        })
        .then(data => {
          const items = data.featured.map((featured: any) => {            
            return {
              badge: featured.image,
              text: Utils.textFromHTML(featured.text),
              image: featured.stream.preview.medium
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
        <Item {...{id, item}}/>        
      ));
    };
    return (
      <div className='feed-list' >
        {items()}
      </div>
    );    
  });

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setFeed: (id: string, feed: Feed) => dispatch(setFeed(id, feed)),
});

export const List = connect(undefined, mapDispatchToProps)(ConnectedList);
