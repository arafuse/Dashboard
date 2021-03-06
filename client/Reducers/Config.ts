import * as Immutable from 'immutable';
import { StatefulAction } from '../Actions';

export const ADD_OPTIONS = 'ADD_OPTIONS';
export type ADD_OPTIONS = typeof ADD_OPTIONS;

export const SET_OPTIONS = 'SET_OPTIONS';
export type SET_OPTIONS = typeof SET_OPTIONS;

export const DELETE_OPTIONS = 'DELETE_OPTIONS';
export type DELETE_OPTIONS = typeof DELETE_OPTIONS;

export const TOGGLE_OPTIONS = 'TOGGLE_OPTIONS';
export type TOGGLE_OPTIONS = typeof TOGGLE_OPTIONS;

export const DEFAULT_COLUMN_WIDTH = 350;

export type Validator = (id: string, key: string, value: any, options: Options) => any;

export interface Options extends Immutable.Map<string, any> {
  show: boolean;
  type: string;
  width: number;
  query: string;
  source: string;
  validator: Validator;
}

export interface OptionsUpdate {
  show?: boolean;
  type?: string;
  width?: number;
  query?: string;
  source?: string;
  validator?: Validator;
}

export type State = Immutable.Map<string, any>;

export const OptionsRecord = Immutable.Record({
  show: false,
  type: '',
  width: DEFAULT_COLUMN_WIDTH,
  query: '',
  source: '',
  validator: null
}, 'Options');

export const addOptions = (id: string, options: OptionsUpdate) => ({ type: ADD_OPTIONS, id: id, payload: options });
export const setOptions = (id: string, options: OptionsUpdate) => ({ type: SET_OPTIONS, id: id, payload: options });
export const deleteOptions = (id: string) => ({ type: ADD_OPTIONS, id: id });
export const toggleOptions = (id: string) => ({ type: TOGGLE_OPTIONS, id: id });

const initialState = Immutable.Map<string, any>();

export const reducer = (state: State = initialState, action: StatefulAction) => {
  switch (action.type) {
    case ADD_OPTIONS:
      const options = OptionsRecord(action.payload);
      return updateOptionsState(
        action.id as string,
        state.set(action.id as string, OptionsRecord(action.payload)), options.toJS()
      );
    case SET_OPTIONS:
      return updateOptionsState(action.id as string, state, action.payload);
    case DELETE_OPTIONS:
      return state.delete(action.id as string);
    case TOGGLE_OPTIONS:
      return state.setIn([action.id, 'show'], !state.getIn([action.id, 'show']));
    default:
      return state;
  }
};

const updateOptionsState = (id: string, state: State, update: OptionsUpdate): State => {
  const options = state.get(id);
  return state.withMutations((newState) => {
    Object.entries(update).forEach(([key, value]) => {
      value = options.validator ? options.validator(key, value, options) : value;
      newState.setIn([id, key], value);
    });
  });
};
