import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import NewBoard from './UI/new_board/new_board';
import { useDispatch } from 'react-redux';
import { fetchBoardContentByBoardId, getBoardDetailDataMiddleWare } from './logic/board_reducer';
// import { fetchBoardContentByBoardId } from './logic/board_reducer';
// interface BodyProps {
//   idBoard?: string | string[];
// }
const New = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    fetchDataProject();
    dispatch(fetchBoardContentByBoardId(query.id));
  }, [query.id]);

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
