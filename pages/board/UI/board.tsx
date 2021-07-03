import BoardCard from 'pages/board/UI/board_card/board_card';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { RootState } from 'redux/reducers_registration';
import { createFlowChartMiddleWare, getBoardDataMiddleWare } from '../logic/board_reducer';
import { DisappearedLoading } from 'react-loadingg';
import { BoardsPage } from 'helpers/type';
import { Typography } from '@material-ui/core';

interface InitialProps {
  loading: boolean;
}

type BoardsType = InitialProps;

const BoardUI: FunctionComponent<BoardsType> = (props: InitialProps) => {

  const { loading }: InitialProps = props;
  const {
    boards,
    hasNoBoards,
  }: BoardsPage = useSelector((state: RootState) => state.boards);
  const dispatch = useDispatch();
  // const board = useSelector((state: RootState) => state.boards);
  const listBoards = boards;
  const router = useRouter();
  const pathname = router.pathname;

  const handleBtnNewFlowChart = () => {
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

  const generateBoardItem = () => {
    if (!boards.length && hasNoBoards) {
      return (
        <div className='empty-state'>
          <img alt='logo' width='100px' src='../document.svg'/>
          <Typography color='textSecondary' className='empty-state--text'>Not found any Boards</Typography>
        </div>
      );
    }

    return(
      <div className='list-board'>
        {Array.isArray(listBoards) && listBoards.map((item, index) => {
          return (
            <BoardCard key={item?._id ?? index} board={item}/>
          );
        })}
      </div>
    );
  };

  return (
    <div className='flowchart'>
      <h1 className='text-flowchart'>FlowCharts</h1>
      <div className='btn-new'>
        <PrimaryButtonUI
          title='+ FlowChart'
          handleClick={() => handleBtnNewFlowChart()}
        />
      </div>
      {!loading && generateBoardItem()}
      {loading && <DisappearedLoading color={'#67cb48'}/>}
    </div>
  );
};

export default BoardUI;
