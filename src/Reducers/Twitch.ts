import * as Immutable from 'immutable';

import { StatefulAction } from '../Actions';
import {  } from './Config'; 

export const SET_FEED = 'SET_FEED';
export type SET_FEED = typeof SET_FEED;

export const CONCAT_FEED = 'CONCAT_FEED';
export type CONCAT_FEED = typeof CONCAT_FEED;

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
  next?: string;
  items: Array<Item>;
}

export const addFeed = (id: string) => ({ type: ADD_FEED, id: id });
export const deleteFeed = (id: string) => ({ type: DELETE_FEED, id: id });
export const setFeed = (id: string, feed: Feed) => ({ type: SET_FEED, id: id, payload: feed });
export const concatFeed = (id: string, feed: Feed) => ({ type: CONCAT_FEED, id: id, payload: feed });

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
      action.payload.error && console.error(action.payload.error);
      return state.set(action.id, action.payload);
    case CONCAT_FEED:
      if (action.id === undefined) throw ('Got \'undefined\' action id');
      const feed = state.get(action.id);
      return state.set(action.id,
        { ...feed, next: action.payload.next, items: feed.items.concat(action.payload.items) });
    default:
      return state;
  }
};
