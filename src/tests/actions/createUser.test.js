import faker from 'faker';
import createAccount from '../../actions/createUser';
import executeAction from '../utils/index';

const user = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

describe('createUser createAccount', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute verifyToken action, simulate registration successful request',
    async () => {
      const body = {
        user: {
          ...user,
          id: 1,
          createdDate: 'Jul 12, 2018',
          lastModified: 'Jul 12, 2018'
        },
        status: 'Successful',
        message: 'Successfully retrieved all user information'
      };
      const init = {
        status: 200,
        statusText: 'Success',
        headers: {
          'X-Access-Token': body.token
        }
      };

      fetch
        .mockResponseOnce(JSON.stringify(body), init);
      const actions = await executeAction(createAccount, user);
      expect(actions)
        .toHaveLength(4);
    });
  test('should execute verifyToken action, simulate verification failed request', async () => {
    const body = {
      message: 'Invalid input params'
    };
    const init = {
      status: 400,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(createAccount, user);
    expect(actions)
      .toHaveLength(4);
  });
});
