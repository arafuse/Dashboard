import './StreamViewer.css';

import * as React from 'react';

import { Toolbar, ToolbarProps } from '../Components/Toolbar';
import { Container, ContainerProps } from '../Components/Feed/Container';

export const StreamViewer: React.StatelessComponent = () => (
  <div className='stream-viewer'>  
    <Toolbar {...{} as ToolbarProps} />  
    <Container {...{} as ContainerProps} /> 
  </div>
);


