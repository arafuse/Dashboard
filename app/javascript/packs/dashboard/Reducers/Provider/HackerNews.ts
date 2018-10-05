import * as Immutable from 'immutable';

import { StatefulAction } from '../../Actions';
import * as Config from '../Config';

export const SET_FEED = 'HN_SET_FEED';
export type SET_FEED = typeof SET_FEED;

export const CONCAT_FEED = 'HN_CONCAT_FEED';
export type CONCAT_FEED = typeof CONCAT_FEED;

export const ADD_FEED = 'HN_ADD_FEED';
export type ADD_FEED = typeof ADD_FEED;

export const DELETE_FEED = 'HN_DELETE_FEED';
export type DELETE_FEED = typeof DELETE_FEED;

export const SET_ITEM = 'HN_SET_ITEM';
export type SET_ITEM = typeof SET_ITEM;

export const MIN_COLUMN_WIDTH = 350;

export interface ItemParams {
  title?: string;
  user?: string;
  badge?: string;
  content?: string;
  image?: string;
  link?: string;
}

export const ItemRecord = Immutable.Record({
  title: '',
  badge: '',
  user: '',
  content: '',
  image: '',
  link: ''
});

export class Item extends ItemRecord {
  title: string | undefined;
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
  storyIds: Array<string>;
}

export interface FeedParams {
  status?: string;
  error?: string;
  items?: Immutable.OrderedMap<string, Item>;
  storyIds?: Array<string>;
}

export type State = Immutable.Map<string, any>;

export const FeedRecord = Immutable.Record({
  status: 'new',
  error: '',
  items: Immutable.List<Item>(),
  storyIds: [],
}, 'Feed');

export const addFeed = (id: string) => ({ type: ADD_FEED, id: id });
export const deleteFeed = (id: string) => ({ type: DELETE_FEED, id: id });
export const setFeed = (id: string, feed: FeedParams) => ({ type: SET_FEED, id: id, payload: feed });
export const concatFeed = (id: string, feed: FeedParams) => ({ type: CONCAT_FEED, id: id, payload: feed });
export const setItem = (id: string, item: SetItemParams) => ({type: SET_ITEM, id: id, payload: item});

const initialState = Immutable.Map<string, any>();

export const reducer = (state: State = initialState, action: StatefulAction) => {
  switch (action.type) {
    case ADD_FEED:      
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

export const configValidator = (key: string, value: any, options: Config.Options): any => {
  if (key === 'width') {
    if (isNaN(value)) return options.get('width');
    else if (value < MIN_COLUMN_WIDTH) return MIN_COLUMN_WIDTH;
  }
  return value;
};
