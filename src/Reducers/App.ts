import * as Immutable from 'immutable';
import { StatefulAction } from '../Actions';

export const TOGGLE_NEW_FEED = 'TOGGLE_NEW_FEED';
export type TOGGLE_NEW_FEED = typeof TOGGLE_NEW_FEED;

export interface State {
  'showNewFeed': boolean; 
}

export const StateRecord = Immutable.Record({
  'showNewFeed': false
});

export const toggleNewFeed = () => ({ type: TOGGLE_NEW_FEED });

const initialState = StateRecord();

export const reducer = (state = initialState, action: StatefulAction) => {
  switch (action.type) {
    case TOGGLE_NEW_FEED:    
      console.log('Toggle');
      return state.set('showNewFeed', !state.get('showNewFeed'));
    default:
      return state;
  }
};
