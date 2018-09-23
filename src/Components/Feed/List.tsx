import './List.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { setFeed } from '../../Actions';
import { Feed } from '../../Models';
import { statelessComponent } from '../HOC/Stateless';

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
      setFeed(id, { status: 'loading' });
      fetch('https://api.twitch.tv/kraken/streams/featured?client_id=' + CLIENT_ID)
        .then(response => {
          return response.json();
        })
        .then(data => {
          const items = data.featured.map((featured: any) => {
            return featured.stream;
          });
          setFeed(id, { status: 'loaded', items: items });
        })
        .catch(error => {
          setFeed(id, { status: 'error', error: error });
        });
    }
  })(({ feed }) => (
    <div className='stream-list' >
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : (
        <p>{JSON.stringify(feed)}</p>
      )}
    </div >
  ));

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({  
  setFeed: (id: string, feed: Feed) => dispatch(setFeed(id, feed)),  
});

export const List = connect(undefined, mapDispatchToProps)(ConnectedList);
