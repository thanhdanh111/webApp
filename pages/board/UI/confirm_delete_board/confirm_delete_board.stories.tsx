import { storiesOf } from '@storybook/react';
import React from 'react';
import ConfirmDeleteBoard from './confirm_delete_board';

storiesOf('ConfirmDialog Scripts', module).add('ConfirmDialog Scripts', () => {
  return (
    <>
        <ConfirmDeleteBoard open={false} handleDelete={() => ''} onClose={() => ''} />
    </>
  );
});
