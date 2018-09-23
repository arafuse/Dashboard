import * as Immutable from 'immutable';
import { v4 as uuidv4 } from 'uuid';

import { StatefulAction } from '../Actions';

export const SET_FEED = 'SET_FEED';
export type SET_FEED = typeof SET_FEED;

export const ADD_FEED = 'ADD_FEED';
export type ADD_FEED = typeof ADD_FEED;

export const DELETE_FEED = 'DELETE_FEED';
export type DELETE_FEED = typeof DELETE_FEED;

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
  error?: string;
  items: Array<Item>;
}

export const addFeed = () => ({ type: ADD_FEED, id: uuidv4() });
export const deleteFeed = (id: string) => ({ type: DELETE_FEED, id: id });
export const setFeed = (id: string, feed: Feed) => ({ type: SET_FEED, id: id, payload: feed });

const initialState = Immutable.Map<string, any>();

export const reducer = (state = initialState, action: StatefulAction) => {
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
