import './Toolbar.css';

import * as React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import * as App from '../Reducers/App';
import { State } from '../Store';
import { statelessComponent } from './HOC/Stateless';
import { NewFeed, NewFeedProps } from './NewFeed';

export interface ToolbarProps {
  app: App.State;
  toggleNewFeed(): void;
  handleToggleNewFeed(): (props: ToolbarProps) => void;
}

const ConnectedToolbar = statelessComponent<ToolbarProps>({
  handleToggleNewFeed: () => ({ toggleNewFeed }: ToolbarProps) => {
    toggleNewFeed();
  },
})((props) => (
  <div className='toolbar' >
    <i className='icon fa fa-plus-square fa-lg' aria-hidden='true' onClick={props.handleToggleNewFeed}></i>
    <NewFeed {... { show: props.app.showNewFeed } as NewFeedProps} />
  </div>
));

const mapStateToProps = (state: State) => ({
  app: state.get('app'),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  toggleNewFeed: () => dispatch(App.toggleNewFeed())
});

export const Toolbar = connect(mapStateToProps, mapDispatchToProps)(ConnectedToolbar);
