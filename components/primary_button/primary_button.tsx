import React, { FunctionComponent } from 'react';
import {
  Button,
} from '@material-ui/core';

interface DataType {
  title: string;
  handleClick: () => void;
  extendClass?: string;
}

type BodyProps = DataType;

const PrimaryButtonUI: FunctionComponent<BodyProps> = ({ title, handleClick, extendClass }) => {

  return (
    <div className={`btn-primary-container ${extendClass}`}>
      <Button color='secondary' variant='contained' onClick={handleClick} className='btn-primary' >
        {title}
      </Button>
    </div>
  );
};

export default PrimaryButtonUI;
