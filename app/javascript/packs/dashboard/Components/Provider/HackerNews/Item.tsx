import './Item.css';

import * as React from 'react';

import * as HackerNews from '../../../Reducers/Provider/HackerNews';
import { statelessComponent } from '../../HOC/Stateless';

export interface ItemProps {
  item: HackerNews.Item;
  handleBadgeError(event: HTMLElementEvent<HTMLImageElement>): void 
}

export const Item = statelessComponent<ItemProps>({
  handleBadgeError: (event: HTMLElementEvent<HTMLImageElement>) => {
    event.target.src = 'https://news.ycombinator.com/favicon.ico'
  }
})(({ item, handleBadgeError }) => {
  return (
    <div className='hn-item' >
      <div className='hn-item__header'>
        <div className='hn-item__badge'>
          <img src={item.badge} onError={handleBadgeError} />
        </div>
        <div className='hn-item__info'>
          <div className='hn-item__title'>
            <a href={item.link} target='_blank'>{item.title}</a>
          </div>
          <div className='hn-item_user'>{item.user}</div>
        </div>
      </div>
      <div className='hn-item__copy-text'>
        {item.content}
        <span className='hn-item__discussion-link'>(<a href={item.discussion}>discussion</a>)</span>
      </div>
      <div className='hn-item__image'>
        <a href={item.link} target='_blank'><img src={item.image} /></a>
      </div>
    </div >
  );
});
