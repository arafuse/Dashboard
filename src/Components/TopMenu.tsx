import './TopMenu.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { addFeed } from '../Actions';
import { statelessComponent } from './HOC/Stateless';

export interface TopMenuProps {
  addFeed(): void;
  plus(): void;
}

const ConnectedTopMenu = statelessComponent<TopMenuProps>({
  plus: () => ({addFeed}: TopMenuProps) => {        
    addFeed();
  },
})(({ plus }) => (
  <div className='top-menu' >
    <i className='icon fa fa-plus-square' aria-hidden='true' onClick={plus}></i>
  </div >
));

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  addFeed: () => dispatch(addFeed())  
});

export const TopMenu = connect(undefined, mapDispatchToProps)(ConnectedTopMenu);
