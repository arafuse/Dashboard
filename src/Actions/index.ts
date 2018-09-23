import { Action } from 'redux';
import { Feed } from '../Models';
import { v4 as uuidv4 } from 'uuid';

export const SET_FEED = 'SET_FEED';
export type SET_FEED = typeof SET_FEED;

export const ADD_FEED = 'ADD_FEED';
export type ADD_FEED = typeof ADD_FEED;

export const DELETE_FEED = 'DELETE_FEED';
export type DELETE_FEED = typeof DELETE_FEED;

export interface StatefulAction extends Action {
  id?: string;
  status?: string;
  payload?: any;
}

export const addFeed = () => ({ type: ADD_FEED, id: uuidv4() });
export const deleteFeed = (id: string) => ({ type: DELETE_FEED, id: id });
export const setFeed = (id: string, feed: Feed) => ({ type: SET_FEED, id: id, payload: feed });
