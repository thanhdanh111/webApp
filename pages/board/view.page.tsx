import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getBoardDetailDataMiddleWare } from './logic/board_reducer';
import CreateBoard from './UI/create_board/create_board';

const View = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    fetchDataProject();
  }, [query.id]);

  const fetchDataProject = () => {
    dispatch(getBoardDetailDataMiddleWare(query.id));
  };

  return (
    <>
      <CreateBoard />
    </>
  );
};

export default View;
