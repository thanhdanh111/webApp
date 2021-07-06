import { Box } from '@material-ui/core';
import React, { FC } from 'react';
import SvgOptionProcess from '@components/svg/svg_option_process';
import SvgOptionDecision from '@components/svg/svg_option_decision';

interface InitialProps {
  onClickAdd: () => void;

}

const ListOptionCard: FC<InitialProps> = (props: InitialProps) => {

  const { onClickAdd }: InitialProps = props;

  return (
    <div className='card-shape-all'>
      <Box className='card-shape'>
        <SvgOptionProcess onClickAdd={onClickAdd}/>
        <SvgOptionDecision onClickAdd={onClickAdd} />
      </Box>
    </div>
  );
};

export default ListOptionCard;
