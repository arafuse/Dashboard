import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as Config from '../../../Reducers/Config';
import * as Twitch from '../../../Reducers/Provider/Twitch';
import { statelessComponent } from '../../HOC/Stateless';
import { Modal, ModalProps } from '../../Modal';
import { FeedProps } from './Feed';

export const AUTO_UPDATE_MILLIS = 1000;

export interface OptionsProps {
  feedProps: FeedProps;
  setOptions: (id: string, options: Config.OptionsUpdate) => void;
  handleFormChange: () => () => (event: React.FormEvent<HTMLFormElement>) => void;
  appendFeed(props: FeedProps): void;
}

export const ConnectedOptions = statelessComponent<OptionsProps>({
  handleFormChange: () => ({ feedProps, appendFeed, setOptions }: OptionsProps) => {
    const { id, setFeed, options, toggleOptions } = feedProps;
    let start = Date.now();
    return (event: HTMLElementEvent<HTMLFormElement | HTMLInputElement>) => {
      event.persist();
      event.preventDefault();
      start = Date.now();
      setTimeout(() => {
        if (Date.now() - start >= AUTO_UPDATE_MILLIS && event.target.name === 'source') {
          const source = event.target.value;
          if (options.source !== source) {
            setOptions(id, { source });
            setFeed(id, { ...Twitch.emptyFeed, status: 'loading' });
            appendFeed({
              ...feedProps,
              options: { ...options, source },
              feed: { ...Twitch.emptyFeed, status: 'loading' }
            });
            toggleOptions(id);
          }
        }
      }, AUTO_UPDATE_MILLIS);
    };
  }
})(({ feedProps, handleFormChange }) => {
  const { options } = feedProps;
  const selections = () => {
    return Object.entries(Twitch.validSources).map(([key, value], index) => (
      <option key={index} value={key}>{value}</option>
    ));
  };
  return (
    <div>
      <Modal {...{ show: options.show } as ModalProps}>
        <div className='options__buttons'>
          <form onChange={handleFormChange()}>
            <label>Source </label>
            <select name='source' defaultValue={options.source}>
              {selections()}
            </select>
          </form>
        </div>
      </Modal>
    </div>
  );
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setFeed: (id: string, feed: Twitch.FeedParams) => dispatch(Twitch.setFeed(id, feed)),
  concatFeed: (id: string, feed: Twitch.FeedParams) => dispatch(Twitch.concatFeed(id, feed)),
  setOptions: (id: string, options: Config.OptionsUpdate) => dispatch(Config.setOptions(id, options)),
  toggleOptions: (id: string) => dispatch(Config.toggleOptions(id))
});

export const Options = connect(undefined, mapDispatchToProps)(ConnectedOptions);
