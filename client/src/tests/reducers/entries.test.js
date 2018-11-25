import {
  ADD_ENTRY,
  ENTRY_LOADING,
  REMOVE_ENTRY,
  SET_ENTRIES,
  SET_QUERY,
  UPDATE_ENTRY
} from '../../actions/entries';
import entries from '../../reducers/entries';

test('SET_ENTRIES', () => {
  const state = {
    entryList: [],
    currentEntry: {},
    queryInfo: {}
  };
  const action = {
    type: SET_ENTRIES,
    entryList: [{
      id: 1,
      title: 'title',
      content: 'content'
    }],
  };
  const newState = entries(state, action);
  expect(newState.entryList)
    .toEqual(action.entryList);
});

test('UPDATE_ENTRY', () => {
  const state = {
    entryList: [{
      id: 1,
      title: 'title',
      content: 'content'
    }, {
      id: 2,
      title: 'title',
      content: 'content'
    }],
    currentEntry: {},
    queryInfo: {}
  };
  const action = {
    type: UPDATE_ENTRY,
    entry: {
      id: 1,
      title: 'mod title',
      content: 'content'
    },
  };
  const newState = entries(state, action);
  expect(newState.entryList)
    .toEqual([{
      id: 1,
      title: 'mod title',
      content: 'content'
    }, {
      id: 2,
      title: 'title',
      content: 'content'
    }]);
});

test('REMOVE_ENTRY', () => {
  const state = {
    entryList: [{
      id: 1,
      title: 'title',
      content: 'content'
    }, {
      id: 2,
      title: 'title',
      content: 'content'
    }],
    currentEntry: {},
    queryInfo: {}
  };
  const action = {
    type: REMOVE_ENTRY,
    id: 1,
  };
  const newState = entries(state, action);
  expect(newState.entryList)
    .toEqual([{
      id: 2,
      title: 'title',
      content: 'content'
    }]);
});

test('ADD_ENTRY', () => {
  const state = {
    entryList: [],
    currentEntry: {},
    queryInfo: {}
  };
  const action = {
    type: ADD_ENTRY,
    entry: {
      id: 1,
      title: 'title',
      content: 'content'
    },
  };
  const newState = entries(state, action);
  expect(newState.entryList)
    .toEqual([{
      id: 1,
      title: 'title',
      content: 'content'
    }]);
});

test('SET_QUERY', () => {
  const state = {
    entryList: [],
    currentEntry: {},
    queryInfo: {}
  };
  const action = {
    type: SET_QUERY,
    query: {
      total: 10,
      size: 2,
      page: 2
    },
  };
  const newState = entries(state, action);
  expect(newState.queryInfo)
    .toEqual({
      total: 10,
      size: 2,
      page: 2
    });
});
test('ENTRY_LOADING', () => {
  const state = {
    entryList: [],
    currentEntry: {},
    queryInfo: {}
  };
  const action = {
    type: ENTRY_LOADING,
    loading: false,
  };
  const newState = entries(state, action);
  expect(newState)
    .toEqual({
      ...state,
      loading: false,
    });
});

test('NO_ACTION', () => {
  const state = {
    entryList: [],
    currentEntry: {},
    queryInfo: {}
  };
  const action = {
    test: 'test'
  };
  const newState = entries(state, action);
  expect(newState)
    .toEqual({
      ...state,
    });
});
