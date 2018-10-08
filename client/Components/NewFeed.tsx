import './NewFeed.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';

import * as App from '../Reducers/App';
import * as Config from '../Reducers/Config';
import * as HackerNews from '../Reducers/Provider/HackerNews';
import * as Twitch from '../Reducers/Provider/Twitch';
import * as Twitter from '../Reducers/Provider/Twitter';
import { statelessComponent } from './HOC/Stateless';
import { Modal, ModalProps } from './Modal';
import * as hnIcon from './Provider/HackerNews/Icon.svg';
import * as rssIcon from './Provider/RSS/Icon.svg';
import * as twitchIcon from './Provider/Twitch/Icon.svg';
import * as twitterIcon from './Provider/Twitter/Icon.svg';

export interface NewFeedProps {
  show: boolean;
  addFeed(type: string): void;
  handleAddFeed(type: string): () => (props: NewFeedProps) => void;
}

export const ConnectedNewFeed = statelessComponent<NewFeedProps>(
  {
    handleAddFeed: (type: string) => ({ addFeed }: NewFeedProps) => () => {
      addFeed(type);
    }
  })(({ show, handleAddFeed }) => {
    return (
      <div className='feedChooser'>
        <Modal {...{ show } as ModalProps}>
          <div className='feedChooser__icons'>
            <img className='feedChooser__icon' src={twitchIcon} onClick={handleAddFeed('twitch')} />
            <img className='feedChooser__icon' src={twitterIcon} onClick={handleAddFeed('twitter')} />
            <img className='feedChooser__icon' src={hnIcon} onClick={handleAddFeed('hn')} />
            <img className='feedChooser__icon' src={rssIcon} />
          </div>
        </Modal>
      </div>
    );
  });

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  addFeed: (type: string) => {
    const id = uuidv4();
    switch (type) {
      case 'twitch':
        dispatch(Twitch.addFeed(id));
        dispatch(Config.addOptions(id, { type, source: Twitch.DEFAULT_SOURCE, validator: Twitch.configValidator }));
        break;
      case 'twitter':
        dispatch(Twitter.newFeed(id));
        dispatch(Config.addOptions(id, { type, validator: Twitter.configValidator }));
        break;
      case 'hn':
        dispatch(HackerNews.addFeed(id));
        dispatch(Config.addOptions(id, { type, validator: HackerNews.configValidator }));
        break;
      default:
        throw ('Got invalid feed type:' + type);
    }
    dispatch(App.toggleNewFeed());
  }
});

export const NewFeed = connect(undefined, mapDispatchToProps)(ConnectedNewFeed);
