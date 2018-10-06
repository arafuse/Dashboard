import { Action } from 'redux';

export interface StatefulAction extends Action {
  id?: string;
  status?: string;
  payload?: any;
}
