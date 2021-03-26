import { storiesOf } from '@storybook/react';
import InviteMembersPage from '../index.page';

storiesOf('Invite members', module).add('Header', () => {
  return <InviteMembersPage />;
});
