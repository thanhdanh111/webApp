import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Board } from 'helpers/type';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Delete } from '@material-ui/icons';
import { deleteBoardMiddleWare } from 'pages/board/logic/board_reducer';
import { useDispatch } from 'react-redux';
import { ConfirmDialog } from '@components/confirm_dialog/confirm_dialog';

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

  const onPushToContentBoard = () => {
    void router.push({ pathname: `${pathname}/view`, query: { id: board?._id } });
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
          <div className='create-name-flowchart' onClick={() => onPushToContentBoard()}>
            <Typography className='name-board'>
              {board?.name}
            </Typography>
          </div>
          <div className='check-box' onClick={() => handleOpenOrClose()}>
            <Delete className='trash-logo'/>
            <ConfirmDialog
              onOpen={open}
              handleClose={handleOpenOrClose}
              handleYes={() => handleDeleteBoard(board._id)}
              status='DELETE'
            />
          </div>
        </CardContent>
      </Card>
      <div className='picture' onClick={() => onPushToContentBoard()}>
        MINI Map
      </div>
    </Grid>
  );
};
export default BoardCard;
