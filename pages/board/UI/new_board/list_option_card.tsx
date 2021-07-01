import { Box } from '@material-ui/core';
import React, { FC } from 'react';

interface InitialProps {
  onClickAddProcess: () => void;
  onClickAddDecision: () => void;
}

const ListOptionCard: FC<InitialProps> = (props: InitialProps) => {

  const { onClickAddProcess, onClickAddDecision }: InitialProps = props;

  return (
    <div className='card-shape-all'>
      <Box className='card-shape'>
        <div className='div-svg-process'>
          <svg onClick={onClickAddProcess} width='34' height='27' className='svg-process'>
            <rect rx='0' ry='100' height='25' width='30' fill='none'/>
          </svg>
        </div>
        <div className='div-svg-decision'>
          <svg width='34' height='33' viewBox='-0.5, -0.5, 31, 31' onClick={onClickAddDecision} >
            <path
              d='M15 0 L0 15 L15 30 L30 15z'
              stroke='#ffffff'
              fill='none'
              strokeWidth='2px'
            />
          </svg>
        </div>
      </Box>
    </div>
  );
};

export default ListOptionCard;
