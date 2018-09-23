import './Item.css';

import * as React from 'react';

import * as Twitch from '../../../Providers/Twitch';
import { statelessComponent } from '../../HOC/Stateless';

export interface ItemProps {
  id: number;
  item: Twitch.Item;
}

export const Item = statelessComponent<ItemProps>()
  (({ id, item }) => {
    return (
      <div key={id} className='feed-element' >
        <div className='feed-element__header'>
          <div className='feed-element__badge'>
            <img src={item.badge} />
          </div>
          <div className='feed-element__info'>
            <div className='feed-element__title'>{item.title}</div>
            <div className='feed-element__channel'>{item.channel}</div>
          </div>
        </div>
        <div className='feed-element__copy-text'>{item.content}</div>
        <img src={item.image} />
      </div >
    );
  });
