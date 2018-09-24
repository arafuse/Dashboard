import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as Config from '../../Providers/Config';
import { statelessComponent } from '../HOC/Stateless';
import { Modal } from '../Modal';

export interface OptionsProps {
  id: string;
  config: Config.Options;
  handleClose(): void;
  closeOptions(id: string): void; 
}

export const ConnectedOptions = statelessComponent<OptionsProps>(
  {
    handleClose: () => ({id, closeOptions}: OptionsProps) => {
      closeOptions(id);
    }
  })(({ config, handleClose }) => (
    <Modal {...{ ...config, handleClose }}>
      Options go here.
    </Modal>
  ));

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  closeOptions: (id: string) => dispatch(Config.closeOptions(id)),
});

export const Options = connect(undefined, mapDispatchToProps)(ConnectedOptions);
