import { storiesOf } from '@storybook/react';
import React from 'react';
import AddTagPopup from './add_tag';

storiesOf('Tag', module).add('Tag', () => {
  return (
    <AddTagPopup/>
  );
});
