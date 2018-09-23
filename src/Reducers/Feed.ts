import * as Immutable from 'immutable';

import { ADD_FEED, DELETE_FEED, SET_FEED, StatefulAction } from '../Actions';
import { Feed } from '../Models';

const initialState = Immutable.Map<string, Feed>();

export const feed = (state = initialState, action: StatefulAction) => {
  switch (action.type) {
    case ADD_FEED:
      if (action.id === undefined) throw ('Got \'undefined\' action id');      
      return state.set(action.id, { status: 'new', error: '', items: [] });
    case DELETE_FEED:
      if (action.id === undefined) throw ('Got \'undefined\' action id');
      return state.delete(action.id);
    case SET_FEED:
      if (action.id === undefined) throw ('Got \'undefined\' action id');
      return state.set(action.id, action.payload);          
    default:
      return state;
  }
};
