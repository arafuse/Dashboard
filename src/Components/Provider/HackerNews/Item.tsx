import './Item.css';

import * as React from 'react';

import * as HackerNews from '../../../Reducers/Provider/HackerNews';
import { statelessComponent } from '../../HOC/Stateless';

export interface ItemProps {  
  item: HackerNews.Item;
}

export const Item = statelessComponent<ItemProps>()
  (({ item }) => {
    return (
      <div className='hn-item' >
        <div className='hn-item__header'>
          <div className='hn-item__badge'>
            <img src={item.badge} />
          </div>
          <div className='hn-item__info'>            
            <div className='hn-item__title'>
              <a href={item.link} target='_blank'>{item.title}</a>
            </div>
          </div>
        </div>
        <div className='hn-item__copy-text'>{item.content}</div>
        <div className='hn-item__image'>
          <a href={item.link} target='_blank'><img src={item.image} /></a>
        </div>
      </div >
    );
  });
