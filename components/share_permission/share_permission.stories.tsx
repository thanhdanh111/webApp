import { storiesOf } from '@storybook/react';
import { SharePermission } from './share_permission';

storiesOf('Share Permission', module).add('Header', () => {
  return <SharePermission
    selectedProject={{}}
    displayShare={true}
    usersInCompanyMap={{}}
    loading={false}
    projectAccessOfUsers={{}}
    accountUserID={''}
    selectedPage={{}}
    handleShare={() => 'handled'}
    handleRemoveRole={({ role, userID }) => {

      return {
        role,
        userID,
      };
    }}
  />;
});
