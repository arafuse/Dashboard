import './Modal.css';

import * as React from 'react';
import { statelessComponent } from './HOC/Stateless';

export interface ModalProps {   
  self: React.Component<ModalProps>; 
  show: boolean;  
  children: React.ReactNode;
  handleClose(): void;
}

export const Modal = statelessComponent<ModalProps>()
  (({ show, children }) => {   
    if (!show) return null;
    return (
      <div className='modal__background'>             
        <div className='modal__foreground'>                     
          {children}          
        </div>
      </div>
    );
  });
