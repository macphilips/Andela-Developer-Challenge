import faker from 'faker';
import executeAction from '../utils/index';
import {
  createEntry, deleteEntry, getEntries, updateEntry
} from '../../actions/entries';

const user = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

describe('getEntries', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute getEntries action, simulate successful request',
    async () => {
      const body = {
        data: {
          entries: [
            {
              id: 0,
              title: 'Nice Title',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin. Aliquam ut hendrerit leo. Phasellus euismod vel dolor non rutrum. Morbi efficitur pellentesque odio, at ornare augue commodo ac. Quisque suscipit nisi quis urna tempus imperdiet. Cras congue, felis scelerisque luctus euismod, nibh leo sagittis odio, eget feugiat dolor libero quis tellus.',
              createdDate: 'Jul 12, 2018',
              lastModified: 'Jul 12, 2018',
              userID: 1
            }
          ],
          page: 1,
          totalEntries: 10
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
      const actions = await executeAction(getEntries, { size: 10 });
      expect(actions)
        .toHaveLength(2);
    });
  test('should execute getEntries action, simulate failed request', async () => {
    const body = {
      message: 'Authentication failed invalid credentials'
    };
    const init = {
      status: 500,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(getEntries, { size: 10 });
    expect(actions)
      .toHaveLength(2);
  });
});

describe('updateEntry', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute updateEntry action, simulate successful request',
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
      const actions = await executeAction(updateEntry, {});
      expect(actions)
        .toHaveLength(4);
    });
  test('should execute updateEntry action, simulate failed request', async () => {
    const body = {
      message: '403 error'
    };
    const init = {
      status: 403,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(updateEntry, {});
    expect(actions)
      .toHaveLength(3);
  });
});


describe('createEntry', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute createEntry action, simulate successful request',
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
      const actions = await executeAction(createEntry, {});
      expect(actions)
        .toHaveLength(4);
    });
  test('should execute createEntry action, simulate failed request', async () => {
    const body = {
      message: '400 error'
    };
    const init = {
      status: 400,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(createEntry, {});
    expect(actions)
      .toHaveLength(3);
  });
});

describe('deleteEntry', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('should execute deleteEntry action, simulate successful request',
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
      const actions = await executeAction(deleteEntry, 1);
      expect(actions)
        .toHaveLength(4);
    });
  test('should execute deleteEntry action, simulate failed request', async () => {
    const body = {
      message: '500 error'
    };
    const init = {
      status: 503,
      statusText: 'error',
    };

    fetch
      .mockResponseOnce(JSON.stringify(body), init);
    const actions = await executeAction(deleteEntry, 1);
    expect(actions)
      .toHaveLength(3);
  });
});
