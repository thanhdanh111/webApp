import React, { FunctionComponent } from 'react';
import {
  Button,
} from '@material-ui/core';

interface DataType {
  title: string;
  handleClick: () => void;
  disabled?: boolean;
}

type BodyProps = DataType;

const PrimaryButtonUI: FunctionComponent<BodyProps> = ({ title, handleClick, disabled }) => {

  return (
    <div className='btn-primary-container'>
      <Button
        color='secondary'
        variant='contained'
        disabled={disabled}
        onClick={handleClick}
        className='btn-primary'
      >
        {title}
      </Button>
    </div>
  );
};

export default PrimaryButtonUI;
