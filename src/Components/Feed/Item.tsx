import './Item.css';

import * as React from 'react';

import { FeedItem } from '../../Models';
import { statelessComponent } from '../HOC/Stateless';

export interface ItemProps {
  id: number;
  item: FeedItem;
}

export const Item = statelessComponent<ItemProps>()
  (({ id, item }) => {    
    return (
      <div key={id} className='feed-element' >
        <img className='feed-element__badge' src={item.badge} />
        <div className='feed-element__copy-text'>{item.text}</div>    
        <img src={item.image} />
      </div >
    );
  });
