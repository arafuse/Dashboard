import * as Immutable from 'immutable';

import { StatefulAction } from '../../Actions';
import * as Config from '../Config'; 

export const SET_FEED = 'SET_FEED';
export type SET_FEED = typeof SET_FEED;

export const CONCAT_FEED = 'CONCAT_FEED';
export type CONCAT_FEED = typeof CONCAT_FEED;

export const ADD_FEED = 'ADD_FEED';
export type ADD_FEED = typeof ADD_FEED;

export const DELETE_FEED = 'DELETE_FEED';
export type DELETE_FEED = typeof DELETE_FEED;

export const MIN_COLUMN_WIDTH = 350;

export interface Item {
  title: string;
  badge: string;
  channel: string;
  content: string;
  image: string;
  link: string;
}

export interface Feed {
  status: string;
  error: string;
  next: string;
  items: Immutable.List<Item>;
}

export interface FeedUpdate {
  status?: string;
  error?: string;
  next?: string;
  items?: Immutable.List<Item>;
}

export type State = Immutable.Map<string, any>;

export const FeedRecord = Immutable.Record({
  status: 'new',
  error: '',
  next: '',
  items: Immutable.List<Item>(),
}, 'Feed');

export const addFeed = (id: string) => ({ type: ADD_FEED, id: id });
export const deleteFeed = (id: string) => ({ type: DELETE_FEED, id: id });
export const setFeed = (id: string, feed: FeedUpdate) => ({ type: SET_FEED, id: id, payload: feed });
export const concatFeed = (id: string, feed: FeedUpdate) => ({ type: CONCAT_FEED, id: id, payload: feed });

const initialState = Immutable.Map<string, any>();

export const reducer = (state: State = initialState, action: StatefulAction) => {
  switch (action.type) {
    case ADD_FEED:
      if (action.id === undefined) throw ('Got \'undefined\' action id');
      return state.set(action.id, FeedRecord());
    case DELETE_FEED:
      if (action.id === undefined) throw ('Got \'undefined\' action id');
      return state.delete(action.id);
    case SET_FEED:
      if (action.id === undefined) throw ('Got \'undefined\' action id');
      action.payload.error && console.error(action.payload.error);
      return updateFeedState(action.id, state, action.payload);
    case CONCAT_FEED:
      if (action.id === undefined) throw ('Got \'undefined\' action id');
      action.payload.error && console.error(action.payload.error);
      const items = state.getIn([action.id, 'items']).concat(action.payload.items);
      return updateFeedState(action.id, state, {...action.payload, items});      
    default:
      return state;
  }
};

const updateFeedState = (id: string, state: State, update: FeedUpdate): State => {
  return state.withMutations((newState) => {
    Object.entries(update).forEach(([key, value]) => newState.setIn([id, key], value));
  });  
};

export const configValidator = (id: string, key: string, value: any, options: Config.Options): any => {  
  if (key === 'width') {    
    if (isNaN(value)) return options.get('width');
    else if (value < MIN_COLUMN_WIDTH) return MIN_COLUMN_WIDTH;
  }
  return value;
};
