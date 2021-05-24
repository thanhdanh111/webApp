import { storiesOf } from '@storybook/react';
import InlineToolbarButton from './inline_toolbar_buttons';

storiesOf('InlineToobarButton', module).add('Header', () => {
  return <InlineToolbarButton
    key='BOLD'
    functionality='BOLD'
    icon='B'
    active={true}
    onClick={(functionality) => functionality}
  />;
});
