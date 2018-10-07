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
export const MIN_QUERY_LENGTH = 3;

export interface ItemParams {
  user?: string;
  badge?: string;
  content?: string;
  image?: string;
  link?: string;
}

export const ItemRecord = Immutable.Record({
  user: '',
  badge: '',
  content: '',
  image: '',
  link: ''
});

export class Item extends ItemRecord {
  user: string | undefined;
  badge: string | undefined;
  content: string | undefined;
  image: string | undefined;
  link: string | undefined;

  constructor(params: ItemParams) {
    params ? super(params) : super();
  }
}

export interface SetItemParams {
  id: string;
  item: ItemParams;
}

export interface Feed {
  status: string;
  error: string;
  items: Immutable.OrderedMap<string, Item>;
  stream: Array<any> | null;
}

export interface FeedParams {
  status?: string;
  error?: string;
  items?: Immutable.OrderedMap<string, Item>;
  stream?: Array<any> | null;
}

export type State = Immutable.Map<string, any>;

export const emptyFeed = {
  status: 'new',
  error: '',
  items: Immutable.OrderedMap<string, Item>(),
  stream: null,  
};

export const FeedRecord = Immutable.Record(emptyFeed, 'Feed');

export const newFeed = (id: string) => ({ type: NEW_FEED, id: id });
export const deleteFeed = (id: string) => ({ type: DELETE_FEED, id: id });
export const setFeed = (id: string, feed: FeedParams) => ({ type: SET_FEED, id: id, payload: feed });
export const concatFeed = (id: string, feed: FeedParams) => ({ type: CONCAT_FEED, id: id, payload: feed });
export const setItem = (id: string, item: SetItemParams) => ({ type: SET_ITEM, id: id, payload: item });

const initialState = Immutable.Map<string, any>();

export const reducer = (state: State = initialState, action: StatefulAction) => {
  switch (action.type) {
    case NEW_FEED:
      return state.set(action.id as string, FeedRecord());
    case DELETE_FEED:
      return state.delete(action.id as string);
    case SET_FEED:
      action.payload.error && console.error(action.payload.error);
      return updateFeedState(action.id as string, state, action.payload);
    case CONCAT_FEED:
      action.payload.error && console.error(action.payload.error);
      const items = state.getIn([action.id, 'items']).concat(action.payload.items);
      return updateFeedState(action.id as string, state, { ...action.payload, items });
    case SET_ITEM:
      action.payload.error && console.error(action.payload.error);
      return updateItemState(action.id as string, state, action.payload);
    default:
      return state;
  }
};

const updateFeedState = (id: string, state: State, params: FeedParams): State => {
  return state.withMutations((newState) => {
    Object.entries(params).forEach(([key, value]) => newState.setIn([id, key], value));
  });
};

const updateItemState = (id: string, state: State, params: SetItemParams): State => {
  return state.withMutations((newState) => {
    Object.entries(params.item).forEach(([key, value]) => newState.setIn([id, 'items', params.id, key], value));
  });
};


 /**
 * Validates Twitter config options. This function is called once for each key, value pair being updated
 * before options are set. 
 * 
 * Enforces limits on minimum column width and query length. When the query changes, the feed stream is 
 * reset to null to allow for it to be refreshed with the new query.
 * 
 * @param {string} id The ID of the current feed.
 * @param {string} key The options key being validated.
 * @param {*} value The options value being validated.
 * @param {Config.Options} options The existing config options for the current feed.
 * @returns {*} The resulting config value.
 */
export const configValidator = (id: string, key: string, value: any, options: Config.Options): any => {
  switch (key) {
    case 'width':
      if (isNaN(value)) return options.get('width');
      else if (value < MIN_COLUMN_WIDTH) return MIN_COLUMN_WIDTH;
    case 'query':
      if (value.length < MIN_QUERY_LENGTH) return options.get('query');
      if (options.get('query') !== value) setFeed(id, {stream: null});
  }
  return value;
};
