import { storiesOf } from '@storybook/react';
import SideToolbarButton  from './side_toolbar_button';

storiesOf('SideToolbarButton', module).add('Header', () => {
  return   <SideToolbarButton
    children={undefined}
    contentBlock={{}}
    onClickSideToolbar={() => 'handled'}
    disableProtal={false}
    actionsNeedToRender={[]}
  />;
});
