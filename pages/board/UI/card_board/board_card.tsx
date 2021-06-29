import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Board } from 'helpers/type';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Delete } from '@material-ui/icons';
import ConfirmDeleteBoard from '../confirm_delete_board/confirm_delete_board';
import { deleteBoardMiddleWare } from 'pages/board/logic/board_reducer';
import { useDispatch } from 'react-redux';

interface InitProps {
  board: Board;
}

type BodyProps = InitProps;

const BoardCard: React.FunctionComponent<BodyProps> = (props: InitProps) => {
  const dispatch = useDispatch();
  const { board }: InitProps = props;
  const router = useRouter();
  const pathname = router.pathname;

  const [open, setOpen] = useState(false);

  const onPushToPage = () => {
    void router.push(`${pathname}/${board?._id}`);
  };

  const handleOpenOrClose = () => {
    setOpen(!open);
  };

  const handleDeleteBoard = (id: string) => {
    dispatch(deleteBoardMiddleWare(id));
  };

  return (
    <Grid item xs={12} sm={3} className='board-grid'>
      <Card className='board-card'>
        <CardContent className='board-card-content'>
          <div className='create-name-flowchart' onClick={() => onPushToPage()}>
            <div className='avt-flowchart'>
              <span className='span'>
                <svg width='16' height='16' viewBox='0 0 16 16'>
                  <g>
                    <path fill-rule='evenodd' clip-rule='evenodd' d='M7.02186 0.368705C7.51117 -0.121817 8.30413 -0.123058 8.79497 0.36593L15.6294 7.17461C16.1304 7.6737 16.1224 8.48865 15.6117 8.97774L8.6434 15.6514C8.14271 16.1309 7.34931 16.1136 6.86988 15.6127L0.349663 8.8009C-0.123517 8.30656 -0.115458 7.52364 0.367798 7.03919L7.02186 0.368705Z' fill='#730FC3'/>
                    <path fill-rule='evenodd' clip-rule='evenodd' d='M5.75693 5.16327C5.75693 4.96599 5.81475 4.80612 5.9304 4.68367C6.04604 4.56122 6.20591 4.5 6.40999 4.5H9.77734C9.98822 4.5 10.1566 4.56122 10.2824 4.68367C10.4083 4.80612 10.4712 4.96258 10.4712 5.15306C10.4712 5.33674 10.4083 5.4898 10.2824 5.61224C10.1566 5.73469 9.98822 5.79592 9.77734 5.79592H7.31815C7.27734 5.79592 7.25693 5.81633 7.25693 5.85714V7.471C7.25693 7.51182 7.27734 7.53222 7.31815 7.53222H9.27734C9.49502 7.53222 9.66509 7.59175 9.78754 7.71079C9.90999 7.82984 9.97121 8.03358 9.97121 8.22406C9.97121 8.41454 9.90999 8.5693 9.78754 8.68835C9.66509 8.80739 9.49502 8.86692 9.27734 8.86692H7.31815C7.27734 8.86692 7.25693 8.88732 7.25693 8.92814V10.7041C7.25693 10.9422 7.1872 11.1344 7.04774 11.2806C6.90829 11.4269 6.72972 11.5 6.51203 11.5C6.29434 11.5 6.11407 11.4269 5.97121 11.2806C5.82836 11.1344 5.75693 10.9422 5.75693 10.7041V5.16327Z' fill='#ffffff' />
                  </g>
                </svg>
              </span>
            </div>
            <Typography className='name-board'>
              {board?.name}
            </Typography>
          </div>
          <div className='check-box' onClick={() => handleOpenOrClose()}>
            <Delete className='trash-logo'/>
            <ConfirmDeleteBoard open={open} onClose={handleOpenOrClose} handleDelete={() => handleDeleteBoard(board._id)}/>
          </div>
        </CardContent>
      </Card>
      <div className='picture' onClick={() => onPushToPage()}>
        MINI Map
      </div>
    </Grid>
  );
};
export default BoardCard;
