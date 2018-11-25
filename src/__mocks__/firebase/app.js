const collection = jest.fn(() => ({
  doc: jest.fn(() => ({
    collection,
    update: jest.fn(() => Promise.resolve(true)),
    onSnapshot: jest.fn(() => Promise.resolve(true)),
    get: jest.fn(() => Promise.resolve(true))
  })),
  where: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve(true)),
    onSnapshot: jest.fn(() => Promise.resolve(true)),
  }))
}));

const Firestore = () => ({
  collection
});

Firestore.FieldValue = {
  serverTimestamp: jest.fn()
};

export default class RNFirebase {
  static initializeApp = jest.fn();

  static auth = jest.fn(() => ({
    createUserAndRetrieveDataWithEmailAndPassword: jest.fn(() => Promise.resolve(true)),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve(true)),
    signInAndRetrieveDataWithEmailAndPassword: jest.fn(() => Promise.resolve(true)),
    fetchSignInMethodsForEmail: jest.fn(() => Promise.resolve(true)),
    signOut: jest.fn(() => Promise.resolve(true)),
    onAuthStateChanged: jest.fn(),
    currentUser: {
      sendEmailVerification: jest.fn(() => Promise.resolve(true))
    }
  }));

  static firestore = Firestore;

  static notifications = jest.fn(() => ({
    onNotification: jest.fn(),
    onNotificationDisplayed: jest.fn(),
    onNotificationOpened: jest.fn()
  }));

  static messaging = jest.fn(() => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    usePublicVapidKey: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    deleteToken: jest.fn(() => Promise.resolve('RN-Firebase-Token')),
    getToken: jest.fn(() => Promise.resolve('RN-Firebase-Token')),
    onTokenRefresh: jest.fn(() => Promise.resolve('RN-Firebase-Token')),
    onMessage: jest.fn(() => Promise.resolve({
      title: '',
      body: ''
    })),
    useServiceWorker: jest.fn(),
  }));

  static storage = jest.fn(() => ({
    ref: jest.fn(() => ({
      child: jest.fn(() => ({
        put: jest.fn(() => Promise.resolve(true))
      }))
    }))
  }));
}
