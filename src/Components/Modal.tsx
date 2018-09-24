import './Modal.css';

import * as React from 'react';
import { statelessComponent } from './HOC/Stateless';

export interface ModalProps {
  show: boolean;  
  children: React.ReactNode;
  handleClose(): void;
}

export const Modal = statelessComponent<ModalProps>()
  (({ show, children, handleClose }) => {
    if (!show) return null;
    return (
      <div className='modal__background'>
        <div className='modal__foreground'>
          {children}
          <div className='modal__buttons'>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    );
  });
