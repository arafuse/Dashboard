import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as Config from '../../../Reducers/Config';
import { statelessComponent } from '../../HOC/Stateless';
import { Modal, ModalProps } from '../../Modal';

export const AUTO_UPDATE_MILLIS = 500;

export interface OptionsProps {
  id: string;
  options: Config.Options;
  setOptions: (id: string, options: Config.OptionsUpdate) => void;
  handleFormChange: () => () => (event: React.FormEvent<HTMLFormElement>) => void;
}

export const ConnectedOptions = statelessComponent<OptionsProps>({
  handleFormChange: () => ({ id, setOptions }: OptionsProps) => {
    let start = Date.now();
    return (event: HTMLElementEvent<HTMLFormElement | HTMLInputElement>) => {
      event.persist();
      event.preventDefault();
      start = Date.now();
      setTimeout(() => {
        if (Date.now() - start >= AUTO_UPDATE_MILLIS) {
          switch (event.target.name) {
            case 'query':
              setOptions(id, { query: event.target.value });
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
  setOptions: (id: string, options: Config.OptionsUpdate) => dispatch(Config.setOptions(id, options))
});

export const Options = connect(undefined, mapDispatchToProps)(ConnectedOptions);
