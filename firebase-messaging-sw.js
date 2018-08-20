/* eslint-disable no-undef,no-restricted-globals */
// Source: https://github.com/firebase/quickstart-js/issues/216
importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-messaging.js');

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBSW5FtfJmEKLDXEM0SM4_LRkw11AiYbys',
  authDomain: 'alc-mydiary.firebaseapp.com',
  databaseURL: 'https://alc-mydiary.firebaseio.com',
  projectId: 'alc-mydiary',
  storageBucket: 'alc-mydiary.appspot.com',
  messagingSenderId: '432621595115',
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = `${payload.notification.title}`;

  const notificationOptions = {
    body: payload.notification.body,
    icon: 'favicon.ico',
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});


self.addEventListener('notificationclick', (event) => {
  const url = event.notification.tag;// .click_action;
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i += 1) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
      return null;
    }),
  );
});
