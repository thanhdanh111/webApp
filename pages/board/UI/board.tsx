import BoardCard from 'pages/board/UI/card_board/board_card';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { RootState } from 'redux/reducers_registration';
import { createFlowChartMiddleWare, getBoardDataMiddleWare } from '../logic/board_reducer';

const Board: FunctionComponent = () => {
  const dispatch = useDispatch();
  const board = useSelector((state: RootState) => state.boards);
  const listBoards = board.boards;
  const router = useRouter();
  const pathname = router.pathname;

  const onPushToPage = () => {
    try {
      dispatch(createFlowChartMiddleWare(
        router,
        pathname,
      ));
      dispatch(pushNewNotifications({ variant: 'success', message: 'Create FlowChart successfully' }));
    } catch (error) {
      dispatch(pushNewNotifications({ variant: 'error', message: 'Failed Create FlowChart' }));
    }
  };

  useEffect(() => {
    return void fetchDataProject();
  }, []);

  const fetchDataProject = () => {
    dispatch(getBoardDataMiddleWare());
  };

  return (
    <div className='flowchart'>
      <h1 className='text-flowchart'>FlowCharts</h1>
      <div className='btn-new'>
        <PrimaryButtonUI
          title='+ FlowChart'
          handleClick={() => onPushToPage()}
        />
      </div>
      <div className='list-board'>
        {Array.isArray(listBoards) && listBoards.map((item, index) => {
          return (
            <BoardCard key={item?._id ?? index} board={item}/>
          );
        })}

      </div>
    </div>
  );
};

export default Board;
