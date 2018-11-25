import faker from 'faker';
import executeAction from '../utils/index';
import {
  getProfile, updatePassword, updateProfile, updateSettings
} from '../../actions/profile';

const user = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

describe('getProfile', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute getProfile action, simulate successful request',
    async () => {
      const body = {
        data: {
          user: {
            id: 12,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            createdDate: 'Jul 12, 2018',
            lastModified: 'Jul 12, 2018'
          },
          reminder: {
            id: 13,
            time: 1119,
            from: 'MONDAY',
            to: 'FRIDAY',
            userId: 1
          },
          entry: {
            count: 10,
            lastModified: 'Jul 12, 2018'
          }
        },
        status: 'Successful',
        message: 'Successfully retrieved all user information'
      };
      const init = {
        status: 200,
        statusText: 'Success',
      };

      fetch
        .mockResponseOnce(JSON.stringify(body), init);
      const actions = await executeAction(getProfile);
      expect(actions)
        .toHaveLength(1);
    });
  test('should execute getProfile action, simulate failed request', async () => {
    const body = {
      message: 'Authentication failed invalid credentials'
    };
    const init = {
      status: 500,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(getProfile, true);
    expect(actions)
      .toHaveLength(1);
  });
});

describe('updateProfile', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute updateProfile action, simulate successful request',
    async () => {
      const body = {
        entry: {
          id: 0,
          title: 'Nice Title',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin. Aliquam ut hendrerit leo. Phasellus euismod vel dolor non rutrum. Morbi efficitur pellentesque odio, at ornare augue commodo ac. Quisque suscipit nisi quis urna tempus imperdiet. Cras congue, felis scelerisque luctus euismod, nibh leo sagittis odio, eget feugiat dolor libero quis tellus.',
          createdDate: 'Jul 12, 2018',
          lastModified: 'Jul 12, 2018',
          userID: 1
        },
        status: 'Successful',
        message: 'Successfully created/retrieved/updated entry'
      };
      const init = {
        status: 200,
        statusText: 'Success',
        headers: {
          'X-Access-Token': body.token
        }
      };

      fetch
        .mockResponseOnce(JSON.stringify(body), init)
        .once(JSON.stringify({ ...user }));
      const actions = await executeAction(updateProfile, {});
      expect(actions)
        .toHaveLength(4);
    });
  test('should execute updateProfile action, simulate failed request', async () => {
    const body = {
      message: '403 error'
    };
    const init = {
      status: 403,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(updateProfile, {});
    expect(actions)
      .toHaveLength(3);
  });
});

describe('updatePassword', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute updatePassword action, simulate successful request',
    async () => {
      const body = {
        entry: {
          id: 0,
          title: 'Nice Title',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin. Aliquam ut hendrerit leo. Phasellus euismod vel dolor non rutrum. Morbi efficitur pellentesque odio, at ornare augue commodo ac. Quisque suscipit nisi quis urna tempus imperdiet. Cras congue, felis scelerisque luctus euismod, nibh leo sagittis odio, eget feugiat dolor libero quis tellus.',
          createdDate: 'Jul 12, 2018',
          lastModified: 'Jul 12, 2018',
          userID: 1
        },
        status: 'Successful',
        message: 'Successfully created/retrieved/updated entry'
      };
      const init = {
        status: 201,
        statusText: 'Success',
      };

      fetch
        .mockResponseOnce(JSON.stringify(body), init);
      const actions = await executeAction(updatePassword, {});
      expect(actions)
        .toHaveLength(3);
    });
  test('should execute updatePassword action, simulate failed request', async () => {
    const body = {
      message: '400 error'
    };
    const init = {
      status: 400,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(updatePassword, {});
    expect(actions)
      .toHaveLength(3);
  });
});

describe('updateSettings', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute updateSettings action, simulate successful request',
    async () => {
      const body = {
        entry: {
          id: 0,
          title: 'Nice Title',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin. Aliquam ut hendrerit leo. Phasellus euismod vel dolor non rutrum. Morbi efficitur pellentesque odio, at ornare augue commodo ac. Quisque suscipit nisi quis urna tempus imperdiet. Cras congue, felis scelerisque luctus euismod, nibh leo sagittis odio, eget feugiat dolor libero quis tellus.',
          createdDate: 'Jul 12, 2018',
          lastModified: 'Jul 12, 2018',
          userID: 1
        },
        status: 'Successful',
        message: 'Successfully created/retrieved/updated entry'
      };
      const init = {
        status: 201,
        statusText: 'Success',
      };
      fetch
        .once(JSON.stringify(body), init)
        .once(JSON.stringify(body), init)
        .once(JSON.stringify(body), init);
      const actions = await executeAction(updateSettings, { enabled: true });
      expect(actions)
        .toHaveLength(4);
    });
  test('should execute updateSettings action, with notification disabled, simulate successful request',
    async () => {
      const body = {
        entry: {
          id: 0,
          title: 'Nice Title',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin. Aliquam ut hendrerit leo. Phasellus euismod vel dolor non rutrum. Morbi efficitur pellentesque odio, at ornare augue commodo ac. Quisque suscipit nisi quis urna tempus imperdiet. Cras congue, felis scelerisque luctus euismod, nibh leo sagittis odio, eget feugiat dolor libero quis tellus.',
          createdDate: 'Jul 12, 2018',
          lastModified: 'Jul 12, 2018',
          userID: 1
        },
        status: 'Successful',
        message: 'Successfully created/retrieved/updated entry'
      };
      const init = {
        status: 201,
        statusText: 'Success',
      };
      fetch
        .once(JSON.stringify(body), init)
        .once(JSON.stringify(body), init)
        .once(JSON.stringify(body), init);
      const actions = await executeAction(updateSettings, { enabled: false });
      expect(actions)
        .toHaveLength(4);
    });
  test('should execute updateSettings action, simulate failed request', async () => {
    const body = {
      message: '500 error'
    };
    const init = {
      status: 503,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(updateSettings, {});
    expect(actions)
      .toHaveLength(3);
  });
});
