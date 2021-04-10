// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/8.3.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.3/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyCC9Fw-20uc_UVKhPcW_Phnac7kleGFqRo",
    authDomain: "test-fcm-652ab.firebaseapp.com",
    projectId: "test-fcm-652ab",
    storageBucket: "test-fcm-652ab.appspot.com",
    messagingSenderId: "961485436410",
    appId: "1:961485436410:web:896e1ede44652c04e2e043",
    measurementId: "G-S8E46696TF"
}
firebase.initializeApp(config);

// Retrieve an instance of Firebase Data Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('On background', payload);
    const title = payload.notification.title;
    const options = {
        body: payload.notification.body
    };
    self.registration.showNotification(title, options);
})
