import './StreamViewer.css';

import * as React from 'react';

import { TopMenu, TopMenuProps } from '../Components/TopMenu';
import { Container, ContainerProps } from '../Components/Feed/Container';

export const StreamViewer: React.StatelessComponent = () => (
  <div className='stream-viewer'>  
    <TopMenu {...{} as TopMenuProps} />  
    <Container {...{} as ContainerProps} /> 
  </div>
);


