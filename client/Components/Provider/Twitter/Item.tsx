import './Item.css';

import * as React from 'react';

import * as Twitter from '../../../Reducers/Provider/Twitter';
import { statelessComponent } from '../../HOC/Stateless';

export interface ItemProps {
  item: Twitter.Item;
  handleBadgeError(event: HTMLElementEvent<HTMLImageElement>): void
}

export const Item = statelessComponent<ItemProps>({
  handleBadgeError: (event: HTMLElementEvent<HTMLImageElement>) => {
    event.target.src = 'https://marketing.twitter.com/content/dam/marketing-twitter/brand/logo.png'
  }
})(({ item, handleBadgeError }) => {
  return (
    <div className='hn-item' >
      <div className='hn-item__header'>
        <div className='hn-item__badge'>
          <a href={item.link} target='_blank'>
            <img src={item.badge} onError={handleBadgeError} />
          </a>
        </div>
        <div className='hn-item__info'>
          <div className='hn-item__user'>
            <a href={item.userLink} target='_blank'>@{item.user}</a>
          </div>
        </div>
      </div>
      <div className='hn-item__copy-text'>
        {item.content}
      </div>
      <div className='hn-item__image'>
        <a href={item.link} target='_blank'><img src={item.image} /></a>
      </div>
    </div >
  );
});
