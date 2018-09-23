import './Container.css';

import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';

import { Feed } from '../../Models';
import { State } from '../../Store';
import { statelessComponent } from '../HOC/Stateless';
import { List, ListProps } from './List';

export interface ContainerProps {
  feeds: Immutable.Map<string, Feed>;
}

const ConnectedContainer = statelessComponent<ContainerProps>(

)(({ feeds }) => {
  return (
    <div className='streams-container'>
      {Object.entries(feeds.toJS()).map(([id, feed]) => (
        <div key={id}>
          <List {...{ id, feed } as ListProps} />
        </div>
      ))}
    </div>
  );
});

const mapStateToProps = (state: State) => {
  return { feeds: state.get('feed') };
};

export const Container = connect(mapStateToProps)(ConnectedContainer);
