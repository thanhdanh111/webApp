import React, { useState } from 'react';
import PageCardUi from '@components/page_card/page_card';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PasswordTabUi from './UI/password_tab';
import GeneralTabUi from './UI/general_tab';
import TabsUi from '@components/tabs/tabs';

const references = ['Management', 'Account', 'Account Settings'];
const tabs = ['general', 'change password'];
const tabIcons = [AccountBoxIcon, VpnKeyIcon];
const tabUIs = [GeneralTabUi, PasswordTabUi];

const AccountPage = () => {
  const [currentTabIndex, setCurrentTab] = useState(0);

  function handleChange(_: React.ChangeEvent<{}>, newValue: number) {
    setCurrentTab(newValue);
  }

  return (
    <>
      <PageCardUi references={references} heading='Account' />
      <TabsUi
        tabs={tabs}
        currentTabIndex={currentTabIndex}
        tabIcons={tabIcons}
        tabUIs={tabUIs}
        handleChange={handleChange}
      />
    </>
  );
};

export default AccountPage;
