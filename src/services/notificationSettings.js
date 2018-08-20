/*
 Source:  https://github.com/firebase/quickstart-js/blob/master/messaging/index.html
          https://github.com/firebase/quickstart-js/issues/216
*/
import firebase from 'firebase/app';
import { printError, windowInterface } from '../utils';

require('firebase/messaging');

// eslint-disable-next-line no-undef
const nav = navigator;

// eslint-disable-next-line no-undef
const Notify = Notification;

const config = {
  apiKey: 'AIzaSyBSW5FtfJmEKLDXEM0SM4_LRkw11AiYbys',
  authDomain: 'alc-mydiary.firebaseapp.com',
  databaseURL: 'https://alc-mydiary.firebaseio.com',
  projectId: 'alc-mydiary',
  storageBucket: 'alc-mydiary.appspot.com',
  messagingSenderId: '432621595115',
};

export default class NotificationSettings {
  static showNotification(notificationTitle, notificationOptions, payload) {
    try {
      const notification = new Notify(notificationTitle, notificationOptions);
      notification.onclick = (event) => {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        windowInterface.open(payload.data.tag, '_blank');
        notification.close();
      };
    } catch (error) {
      try {
        // Need this part as on Android we can only display notifications thru the serviceworker
        nav.serviceWorker.ready.then((registration) => {
          registration.showNotification(notificationTitle, notificationOptions);
        });
      } catch (err1) {
        printError(err1);
      }
    }
  }

  static isTokenSentToServer() {
    return windowInterface.localStorage.getItem('sentToServer') === '1';
  }

  static setTokenSentToServer(sent) {
    windowInterface.localStorage.setItem('sentToServer', sent ? '1' : '0');
  }

  /**
   *
   * @param apiRequest {ApiRequestService}
   */
  constructor(apiRequest) {
    this.apiRequest = apiRequest;
    firebase.initializeApp(config);
    this.messaging = firebase.messaging();
    this.registerServiceWorker();
    this.messaging.usePublicVapidKey('BAYKQUQdxCIqAvMEam9T3TVMXjjlSbDhD7YzxIOtvGCO7pnpdvs4-boURQaaSlbcETXcMDb8NGaQ77sNDbswwuY');
    this.messaging.onTokenRefresh(() => {
      this.messaging.getToken().then((refreshedToken) => {
        NotificationSettings.setTokenSentToServer(false);
        this.sendTokenToServer(refreshedToken);
      }).catch((err) => {
        printError('Unable to retrieve refreshed token ', err);
      });
    });
    this.registerOnMessageEvent();
  }

  registerServiceWorker() {
    if ('serviceWorker' in nav) {
      nav.serviceWorker.register('firebase-messaging-sw.js')
        .then((registration) => {
          this.messaging.useServiceWorker(registration);
        })
        .catch(err => printError(err));
    }
  }

  registerOnMessageEvent() {
    this.messaging.onMessage((payload) => {
      const notificationTitle = `${payload.notification.title}`;
      const notificationOptions = {
        body: payload.notification.body,
        icon: 'favicon.ico',
      };
      if (('Notification' in windowInterface) && Notify.permission === 'granted') {
        NotificationSettings.showNotification(notificationTitle, notificationOptions, payload);
      }
    });
  }

  sendTokenToServer(currentToken) {
    if (!NotificationSettings.isTokenSentToServer()) {
      this.apiRequest.updateGcmToken({ gcmToken: currentToken })
        .then(() => {
          NotificationSettings.setTokenSentToServer(true);
        });
    } else {
      // todo check if token exists on server
    }
  }

  requestPermission() {
    if (Notify.permission !== 'granted') {
      NotificationSettings.setTokenSentToServer(false);
      this.messaging.requestPermission().then(() => {
        this.getToken();
      }).catch((err) => {
        printError(err);
      });
    } else {
      this.getToken();
    }
  }

  getToken() {
    if (Notify.permission === 'granted') {
      this.messaging.getToken().then((currentToken) => {
        if (currentToken) {
          this.sendTokenToServer(currentToken);
        }
      }).catch((err) => {
        NotificationSettings.setTokenSentToServer(false);
        printError(err);
      });
    } else {
      printError(new Error('Do not have permission to use notification'));
    }
  }

  deleteToken() {
    return this.messaging.getToken()
      .then(currentToken => this.messaging.deleteToken(currentToken))
      .then(() => this.apiRequest.deleteGcmToken());
  }
}
