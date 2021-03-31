import React, { FunctionComponent } from 'react';
import {
  Button,
} from '@material-ui/core';

interface DataType {
  title: string;
  handleClick: () => void;
  isSelected: boolean;
}

type BodyProps = DataType;

const SwitchButton: FunctionComponent<BodyProps> = ({ title, handleClick, isSelected }) => {

  return (
    <div className='btn-switch-container'>
      <Button onClick={handleClick} className={isSelected ? 'btn-switch-selected ' : 'btn-switch'}>
        {title}
      </Button>
    </div>
  );
};

export default SwitchButton;
