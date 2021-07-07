import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import NewBoard from './UI/new_board/new_board';
import { useDispatch } from 'react-redux';
import { getBoardDetailDataMiddleWare } from './logic/board_reducer';

const New = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    fetchDataProject();
  }, []);

  const fetchDataProject = () => {
    dispatch(getBoardDetailDataMiddleWare(query.id));
  };

  return (
    <>
      <NewBoard />
    </>
  );
};

export default New;
