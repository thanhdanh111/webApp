import { useRouter } from 'next/router';
import React from 'react';
import NewBoard from './UI/new_board/new_board';

const New = () => {
  const router = useRouter();
  const query = router.query;

  return (
    <>
      <NewBoard idBoard={query.id} />
    </>
  );
};

export default New;
