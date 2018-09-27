import * as Immutable from 'immutable';
import { createStore } from 'redux';

import { StatefulAction } from '../Actions';
import * as App from '../Reducers/App'
import * as Config from '../Reducers/Config';
import * as Twitch from '../Reducers/Provider/Twitch';
import * as HackerNews from '../Reducers/Provider/HackerNews';

export type State = Immutable.Map<string, any>;

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

export const store = createStore(combineReducers({
  app: App.reducer,
  config: Config.reducer,
  twitch: Twitch.reducer,
  hn: HackerNews.reducer
}));
