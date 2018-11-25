export default class RNFirebase {
  static initializeApp = jest.fn();

  static messaging = jest.fn(() => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    usePublicVapidKey: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    deleteToken: jest.fn(token => Promise.resolve(`deleted Firebase Token: ${token}`)),
    getToken: jest.fn(() => Promise.resolve('RN-Firebase-Token')),
    onTokenRefresh: jest.fn(() => Promise.resolve('RN-Firebase-Token')),
    onMessage: jest.fn(() => Promise.resolve({
      title: '',
      body: ''
    })),
    useServiceWorker: jest.fn(),
  }));
}
