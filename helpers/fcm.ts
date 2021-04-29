import { config } from '../helpers/get_config';
import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/analytics';

export const getBrowserToken = async () => {
  firebase.initializeApp(config.FCM);
  firebase.analytics();
  try {
    const messaging = firebase.messaging();
    const statusPermission = await Notification.requestPermission();
    if (!statusPermission || statusPermission !== 'granted') {
      return;
    }

    const browserToken = await messaging.getToken({ vapidKey: 'BA5XCu8TY4LsfCv6ksXL9lrVhTWAu3si3S-1hnLzrdsYBI50hNT_A8GLjhGP7u1Uhc_Zb1ulEWpywekCWdzSQC8' });
    // tslint:disable-next-line:no-console
    console.log(browserToken);
    if (!browserToken) {
      return;
    }

    return browserToken;
  } catch (error) {
    return;
  }
};

export const deleteBrowserToken = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.deleteToken();
  } catch (error) {
    return;
  }
};
