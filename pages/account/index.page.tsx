import React, { useEffect, useState } from 'react';
import PageCardUi from '@components/page_card/page_card';
import { AccountStateType } from './logic/account_reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useSnackbar, WithSnackbarProps } from 'notistack';
import { updateAccountNotifications } from './logic/account_actions';
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
  const { accountNotifications }: AccountStateType = useSelector((state: RootState) => state.account);
  const dispatch = useDispatch();
  const { enqueueSnackbar }: WithSnackbarProps = useSnackbar();
  const [currentTabIndex, setCurrentTab] = useState(0);

  useEffect(pushNotification, [accountNotifications]);

  function pushNotification() {

    if (accountNotifications && accountNotifications.length) {
      for (const notification of accountNotifications) {
        if (!notification) {
          continue;
        }

        enqueueSnackbar(notification.message, { variant: notification['variant'] });
      }

      dispatch(updateAccountNotifications({ notifications: [] }));
    }

    return;
  }

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
