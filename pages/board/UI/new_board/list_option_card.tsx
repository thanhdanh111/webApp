import { Box } from '@material-ui/core';
import React, { FC } from 'react';
import SvgOptionProcess from '@components/svg/svg_option_process';
import SvgOptionDecision from '@components/svg/svg_option_decision';

interface InitialProps {
  onClickAddProcess: () => void;
  onClickAddDecision: () => void;
}

const ListOptionCard: FC<InitialProps> = (props: InitialProps) => {

  const { onClickAddProcess, onClickAddDecision }: InitialProps = props;

  return (
    <div className='card-shape-all'>
      <Box className='card-shape'>
        <SvgOptionProcess onClickAdd={onClickAddProcess}/>
        <SvgOptionDecision onClickAdd={onClickAddDecision} />
      </Box>
    </div>
  );
};

export default ListOptionCard;
