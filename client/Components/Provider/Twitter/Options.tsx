import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as Config from '../../../Reducers/Config';
import * as Twitter from '../../../Reducers/Provider/Twitter';
import { statelessComponent } from '../../HOC/Stateless';
import { Modal, ModalProps } from '../../Modal';

export const AUTO_UPDATE_MILLIS = 500;

export interface OptionsProps {
  id: string;
  options: Config.Options;
  setFeed(id: string, feed: Twitter.FeedParams): void;
  handleFormChange: () => () => (event: React.FormEvent<HTMLFormElement>) => void;
}

export const ConnectedOptions = statelessComponent<OptionsProps>({
  handleFormChange: () => ({ id, setFeed }: OptionsProps) => {
    let start = Date.now();
    return (event: HTMLElementEvent<HTMLFormElement | HTMLInputElement>) => {
      event.persist();
      event.preventDefault();
      start = Date.now();
      setTimeout(() => {
        if (Date.now() - start >= AUTO_UPDATE_MILLIS) {
          switch (event.target.name) {
            case 'query':
              setFeed(id, { query: event.target.value });
          }
        }
      }, AUTO_UPDATE_MILLIS);
    };
  }
})(({ options, handleFormChange }) => (
  <div>
    <Modal {...{ show: options.show } as ModalProps}>
      <div className='options__buttons'>
        <form onChange={handleFormChange()}>
          <label>Query </label><input type='text' name='query' />
        </form>
      </div>
    </Modal>
  </div>
));

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setFeed: (id: string, feed: Twitter.FeedParams) => dispatch(Twitter.setFeed(id, feed))
});

export const Options = connect(undefined, mapDispatchToProps)(ConnectedOptions);
