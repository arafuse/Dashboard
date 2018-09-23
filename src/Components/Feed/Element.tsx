import './Element.css';

import * as React from 'react';

import { FeedItem } from '../../Models';
import { statelessComponent } from '../HOC/Stateless';


export interface ElementProps {
  id: number;
  item: FeedItem;
}

export const Element = statelessComponent<ElementProps>()
  (({ id, item }) => {    
    return (
      <div key={id} className='feed-element' >
        <img className='feed-element__badge' src={item.badge} />
        <div className='feed-element__copy-text'>{item.text}</div>    
        <img src={item.image} />
      </div >
    );
  });
