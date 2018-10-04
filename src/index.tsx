import './index.css';
import 'normalize.css';
import 'font-awesome/css/font-awesome.css';
import 'typeface-roboto';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './Store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);