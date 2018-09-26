import './NewFeed.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import * as twitchIcon from './Provider/Twitch/Icon.svg';

import * as App from '../Reducers/App';
import * as Twitch from '../Reducers/Twitch';
import * as Config from '../Reducers/Config';
import { statelessComponent } from './HOC/Stateless';
import { Modal, ModalProps } from './Modal';

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
          <img className='feedChooser__icon' src={twitchIcon} onClick={handleAddFeed('twitch')} />
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
        dispatch(Config.addOptions(id, { show: false, type: type })); 
        break;       
      default:
        throw ('Got invalid feed type:' + type);        
    }    
    dispatch(App.toggleNewFeed());    
  }
});

export const NewFeed = connect(undefined, mapDispatchToProps)(ConnectedNewFeed);
