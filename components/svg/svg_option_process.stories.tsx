import { storiesOf } from '@storybook/react';
import React from 'react';
import SvgOptionProcess from './svg_option_process';

storiesOf('Svg', module).add('Svg', () => {
  return (
    <SvgOptionProcess
        onClickAdd={() => {
            //
        }}
    />
  );
});
