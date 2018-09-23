import * as Immutable from 'immutable';
import { createStore } from 'redux';

import { StatefulAction } from '../Actions';
import * as Twitch from '../Providers/Twitch';

export type State = Map<string, any>;

export interface Reducer {
  (initialState: any, action: StatefulAction): any;
}

const combineReducers = (reducers: { [index: string]: Reducer }) => {
  let initialState = Immutable.Map<string, any>();
  Object.entries(reducers).forEach(([key, reducer]) => {
    initialState = initialState.set(key, reducer(undefined, { type: undefined }));
  });

  return (state = initialState, action: StatefulAction) => {
    for (const [key, reducer] of Object.entries(reducers)) {
      const sliceState = state.get(key);
      const newSliceState = reducer(sliceState, action);
      if (newSliceState !== sliceState) {
        const newState = state.set(key, newSliceState);
        return newState;
      }
    }
    return state;
  };
};

export const store = createStore(combineReducers({ twitch: Twitch.reducer }));
