import * as Immutable from 'immutable';

import { StatefulAction } from '../../Actions';
import * as Config from '../Config';

export const SET_FEED = 'TWITTER_SET_FEED';
export type SET_FEED = typeof SET_FEED;

export const CONCAT_FEED = 'TWITTER_CONCAT_FEED';
export type CONCAT_FEED = typeof CONCAT_FEED;

export const NEW_FEED = 'TWITTER_NEW_FEED';
export type NEW_FEED = typeof NEW_FEED;

export const DELETE_FEED = 'TWITTER_DELETE_FEED';
export type DELETE_FEED = typeof DELETE_FEED;

export const SET_ITEM = 'TWITTER_SET_ITEM';
export type SET_ITEM = typeof SET_ITEM;

export const MIN_COLUMN_WIDTH = 350;

export interface ItemParams {
  user?: string;
  displayName?: string;
  userLink?: string;
  badge?: string;
  content?: string;
  image?: string;
  link?: string;
}

export interface Item {
  user: string;
  displayName: string;
  userLink: string;
  badge: string;
  content: string;
  image: string;
  link: string;
}

export const emptyItem = {
  user: '',
  displayName: '',
  userLink: '',
  badge: '',
  content: '',
  image: '',
  link: ''
};

export interface SetItemParams {
  id: string;
  item: ItemParams;
}

export interface Feed {
  status: string;
  error: string;
  items: Immutable.OrderedMap<string, Item>;
  stream: NodeJS.ReadableStream | null;
}

export interface FeedParams {
  status?: string;
  error?: string;
  items?: Immutable.OrderedMap<string, Item>;
  stream?: NodeJS.ReadableStream | null;
}

export type State = Immutable.Map<string, any>;

export const emptyFeed = {
  status: 'new',
  error: '',
  items: Immutable.OrderedMap<string, Item>(),
  stream: null,
};

export const newFeed = (id: string) => ({ type: NEW_FEED, id: id });
export const deleteFeed = (id: string) => ({ type: DELETE_FEED, id: id });
export const setFeed = (id: string, feed: FeedParams) => ({ type: SET_FEED, id: id, payload: feed });
export const concatFeed = (id: string, feed: FeedParams) => ({ type: CONCAT_FEED, id: id, payload: feed });
export const setItem = (id: string, item: SetItemParams) => ({ type: SET_ITEM, id: id, payload: item });

const initialState = Immutable.Map<string, any>();

export const reducer = (state: State = initialState, action: StatefulAction) => {
  switch (action.type) {
    case NEW_FEED:
      return state.set(action.id as string, { ...emptyFeed });
    case DELETE_FEED:
      return state.delete(action.id as string);
    case SET_FEED:
      action.payload.error && console.error(action.payload.error);
      return updateFeedState(action.id as string, state, action.payload);
    case CONCAT_FEED:
      action.payload.error && console.error(action.payload.error);
      const items = state.get(action.id as string).items.concat(action.payload.items);
      return updateFeedState(action.id as string, state, { ...action.payload, items });
    case SET_ITEM:
      action.payload.error && console.error(action.payload.error);
      return updateItemState(action.id as string, state, action.payload);
    default:
      return state;
  }
};

const updateFeedState = (id: string, state: State, params: FeedParams): State => {
  return state.set(id, { ...state.get(id), ...params });
};

const updateItemState = (id: string, state: State, params: SetItemParams): State => {
  const items = state.get(id).items;
  const newItems = items.set(params.id, { ...items.get(params.id), ...params.item });
  return state.set(id, { ...state.get(id), items: newItems });
};

export const configValidator = (key: string, value: any, options: Config.Options): any => {
  switch (key) {
    case 'width':
      if (isNaN(value)) return options.get('width');
      else if (value < MIN_COLUMN_WIDTH) return MIN_COLUMN_WIDTH;
  }
  return value;
};
