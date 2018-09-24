import * as Immutable from 'immutable';
import { StatefulAction } from '../Actions';

export const OPEN_OPTIONS = 'OPEN_OPTIONS';
export type OPEN_OPTIONS = typeof OPEN_OPTIONS;

export const CLOSE_OPTIONS = 'CLOSE_OPTIONS';
export type CLOSE_OPTIONS = typeof CLOSE_OPTIONS;

export interface Options {
  show: boolean;
}

export const openOptions = (id: string) => ({ type: OPEN_OPTIONS, id: id });
export const closeOptions = (id: string) => ({ type: CLOSE_OPTIONS, id: id });

const initialState = Immutable.Map<string, any>();

export const reducer = (state = initialState, action: StatefulAction) => {
  switch (action.type) {
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