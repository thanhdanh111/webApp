import { storiesOf } from '@storybook/react';
import React from 'react';
import SvgOptionDecision from './svg_option_decision';

storiesOf('Svg', module).add('Svg', () => {
  return (
    <SvgOptionDecision
      onClickAdd={() => {
        //
      }}
    />
  );
});
