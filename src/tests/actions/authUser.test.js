import faker from 'faker';
import { loginUser, logoutUser } from '../../actions/authUser';
import executeAction from '../utils/index';

const user = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

describe('authUser loginUser', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute verifyToken action, simulate registration successful request',
    async () => {
      const body = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTM0NTE1NDg3LCJleHAiOjE1MzQ2MDE4ODd9.CDlQ2W9Gv-nuYHRMesfL1bJhQmZGCtqOM4pIQGplwsd',
        status: 'Successful',
        message: 'Successfully authenticated user'
      };
      const init = {
        status: 200,
        statusText: 'Success',
        headers: {
          'X-Access-Token': body.token
        }
      };

      fetch
        .once(JSON.stringify(body), init)
        .once(JSON.stringify(body), init)
        .once(JSON.stringify(body), init);
      const actions = await executeAction(loginUser, user);
      expect(actions).toHaveLength(3);
    });
  test('should execute verifyToken action, simulate verification failed request', async () => {
    const body = {
      message: 'Authentication failed invalid credentials'
    };
    const init = {
      status: 403,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(loginUser, user);
    expect(actions)
      .toHaveLength(4);
  });
});

describe('authUser logoutUser', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute logoutUser action, simulate registration successful request',
    async () => {
      const init = {
        status: 200,
        statusText: 'Success',
        headers: {
          'X-Access-Token': ''
        }
      };
      fetch
        .once(JSON.stringify({}), init)
        .once(JSON.stringify({ ...user }));
      const actions = await executeAction(logoutUser);
      expect(actions)
        .toHaveLength(2);
    });
});
