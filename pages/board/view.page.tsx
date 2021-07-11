import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getBoardDetailDataMiddleWare } from './logic/board_reducer';
import ViewBoard from './UI/view_board/view_board';

const View = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    void fetchDataProject();
  }, []);

  const fetchDataProject = () => {
    dispatch(getBoardDetailDataMiddleWare(query.id));
  };

  return (
    <>
      <ViewBoard />
    </>
  );
};

export default View;
