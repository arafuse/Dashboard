import * as React from 'react';
import { hot } from 'react-hot-loader';

import { StreamViewer } from './Views/StreamViewer';

const App = () => (
  <div className='app'>
    <StreamViewer />
  </div>
);

export default hot(module)(App);
