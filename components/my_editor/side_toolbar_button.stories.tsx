import { storiesOf } from '@storybook/react';
import SideToolbarButton  from './side_toolbar_button';

storiesOf('Inline Toolbar', module).add('Header', () => {
  return   <SideToolbarButton
    contentBlock={{}}
    handleOnChangeLineStyle={() => 'handled'}
    onClickSideToolbar={() => 'handled'}
    onMoveBlockAction={() => 'handled'}
  />;
});
