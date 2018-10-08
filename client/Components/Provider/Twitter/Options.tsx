import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as Config from '../../../Reducers/Config';
import * as Twitter from '../../../Reducers/Provider/Twitter';
import { statelessComponent } from '../../HOC/Stateless';
import { Modal, ModalProps } from '../../Modal';
import { FeedProps } from './Feed';

export const AUTO_UPDATE_MILLIS = 500;

export interface OptionsProps {
  id: string;
  feed: Twitter.Feed;
  options: Config.Options;
  setFeed(id: string, feed: Twitter.FeedParams): void;
  concatFeed(id: string, feed: Twitter.FeedParams): void;
  setOptions: (id: string, options: Config.OptionsUpdate) => void;
  handleFormChange: () => () => (event: React.FormEvent<HTMLFormElement>) => void;
  appendFeed(props: FeedProps): void;
}

export const ConnectedOptions = statelessComponent<OptionsProps>({
  handleFormChange: () => ({ id, feed, options, setFeed, concatFeed, appendFeed, setOptions }: OptionsProps) => {
    let start = Date.now();
    return (event: HTMLElementEvent<HTMLFormElement | HTMLInputElement>) => {
      event.persist();
      event.preventDefault();
      start = Date.now();
      setTimeout(() => {
        if (Date.now() - start >= AUTO_UPDATE_MILLIS) {
          switch (event.target.name) {
            case 'query':
              const newQuery = event.target.value;
              if (options.query !== newQuery) {
                setOptions(id, { query: newQuery });
                setFeed(id, { ...Twitter.emptyFeed, status: 'loading' });
                const props = { id, options: { ...options, query: newQuery }, concatFeed } as FeedProps;
                appendFeed({ ...props, feed: { ...Twitter.emptyFeed, status: 'loading' } } as FeedProps);
              }
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
          <label>Query </label><input type='text' name='query' defaultValue={options.query} />
        </form>
      </div>
    </Modal>
  </div>
));

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setFeed: (id: string, feed: Twitter.FeedParams) => dispatch(Twitter.setFeed(id, feed)),
  concatFeed: (id: string, feed: Twitter.FeedParams) => dispatch(Twitter.concatFeed(id, feed)),
  setOptions: (id: string, options: Config.OptionsUpdate) => dispatch(Config.setOptions(id, options))
});

export const Options = connect(undefined, mapDispatchToProps)(ConnectedOptions);
