import * as Immutable from 'immutable';
import { StatefulAction } from '../Actions';

export const ADD_OPTIONS = 'ADD_OPTIONS';
export type ADD_OPTIONS = typeof ADD_OPTIONS;

export const DELETE_OPTIONS = 'DELETE_OPTIONS';
export type DELETE_OPTIONS = typeof DELETE_OPTIONS;

export const OPEN_OPTIONS = 'OPEN_OPTIONS';
export type OPEN_OPTIONS = typeof OPEN_OPTIONS;

export const CLOSE_OPTIONS = 'CLOSE_OPTIONS';
export type CLOSE_OPTIONS = typeof CLOSE_OPTIONS;

export interface Options {
  show: boolean;
  type: string;
}

export const OptionsRecord = Immutable.Record({
  show: false,
  type: ''
});

export const addOptions = (id: string, options: Options) => ({ type: ADD_OPTIONS, id: id, payload: options });
export const deleteOptions = (id: string) => ({ type: ADD_OPTIONS, id: id });
export const openOptions = (id: string) => ({ type: OPEN_OPTIONS, id: id });
export const closeOptions = (id: string) => ({ type: CLOSE_OPTIONS, id: id });

const initialState = Immutable.Map<string, any>();

export const reducer = (state = initialState, action: StatefulAction) => {
  switch (action.type) {
    case ADD_OPTIONS:
      if (action.id === undefined) throw ('Got \'undefined\' action id');      
      return state.set(action.id, OptionsRecord(action.payload));
    case DELETE_OPTIONS:
      if (action.id === undefined) throw ('Got \'undefined\' action id');
      return state.delete(action.id);
    case OPEN_OPTIONS:
      if (action.id === undefined) throw ('Got \'undefined\' action id');        
      return state.setIn([action.id, 'show'], true);
    case CLOSE_OPTIONS:
      if (action.id === undefined) throw ('Got \'undefined\' action id');
      return state.setIn([action.id, 'show'], false);
    default:
      return state;
  }
};
