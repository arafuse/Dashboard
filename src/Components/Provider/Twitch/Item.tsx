import './Item.css';

import * as React from 'react';

import * as Twitch from '../../../Reducers/Twitch';
import { statelessComponent } from '../../HOC/Stateless';

export interface ItemProps {  
  item: Twitch.Item;
}

export const Item = statelessComponent<ItemProps>()
  (({ item }) => {
    return (
      <div className='twitch-item' >
        <div className='twitch-item__header'>
          <div className='twitch-item__badge'>
            <img src={item.badge} />
          </div>
          <div className='twitch-item__info'>
            <div className='twitch-item__title'>{item.title}</div>
            <div className='twitch-item__channel'>
              <a href={item.link} target='_blank'>{item.channel}</a>
            </div>
          </div>
        </div>
        <div className='twitch-item__copy-text'>{item.content}</div>
        <div className='twitch-item__image'>
          <a href={item.link} target='_blank'><img src={item.image} /></a>
        </div>
      </div >
    );
  });
