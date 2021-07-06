import { storiesOf } from '@storybook/react';
import { SharePermission } from './share_permission';

storiesOf('Inline Toolbar', module).add('Header', () => {
  return <SharePermission
    selectedProject={{}}
    openShare={true}
    usersInCompanyMap={{}}
    loading={false}
    projectAccessOfUsers={{}}
    accountUserID={''}
    selectedPage={{}}
    handleShare={() => 'handled'}
  />;
});
