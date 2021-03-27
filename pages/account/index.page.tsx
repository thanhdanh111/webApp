import PageCardUi from '@components/page_card/page_card';
import React from 'react';
import AccountTabsUi from './UI/account_tabs';

const references = ['Management', 'Account', 'Account Settings'];

const AccountPage = () => {

  return (
    <>
      <PageCardUi references={references} heading='Account' />
      <AccountTabsUi />
    </>
  );
};

export default AccountPage;
