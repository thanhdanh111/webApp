// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/8.3.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.3/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyA8UoV0yy076JsQRMSWGinbcqI2iNz7Plw",
    authDomain: "snt-solutions-test2.firebaseapp.com",
    databaseURL: "https://snt-solutions-test2-default-rtdb.firebaseio.com",
    projectId: "snt-solutions-test2",
    storageBucket: "snt-solutions-test2.appspot.com",
    messagingSenderId: "702847935000",
    appId: "1:702847935000:web:002ff21a21d1f3c64b596d",
    measurementId: "G-LY4NXXV8NV"
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
