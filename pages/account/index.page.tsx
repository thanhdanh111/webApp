import PageCardUi from '@components/page_card/page_card';
import React from 'react';
import AccountTabsUi from './UI/account_tabs';

const references = ['Dashboard', 'Management', 'User', 'Account Settings'];

const AccountPage = () => {

  return (
    <div className='account-page'>
      <div className='account-page-toolbar' />
        <PageCardUi references={references} heading='Account' />
        <AccountTabsUi />
    </div>
  );
};

export default AccountPage;
