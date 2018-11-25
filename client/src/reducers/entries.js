import {
  ADD_ENTRY,
  ENTRY_LOADING,
  REMOVE_ENTRY,
  SET_ENTRIES,
  SET_QUERY,
  UPDATE_ENTRY
} from '../actions/entries';

function entries(state = {
  entryList: [],
  currentEntry: {},
  queryInfo: {}
}, action) {
  const { type, ...payload } = action;
  switch (type) {
    case SET_ENTRIES:
      return { ...state, ...payload };
    case UPDATE_ENTRY: {
      const entryList = state.entryList.map((entry) => {
        if (entry.id === payload.entry.id) {
          return { ...entry, ...payload.entry };
        }
        return entry;
      });
      return {
        ...state,
        entryList
      };
    }
    case REMOVE_ENTRY: {
      const entryList = state.entryList.filter(entry => entry.id !== payload.id);
      const queryInfo = {
        ...state.queryInfo,
        total: entryList.length
      };
      return {
        ...state,
        entryList,
        queryInfo
      };
    }
    case ADD_ENTRY: {
      let { entryList } = state;
      entryList = [payload.entry].concat(entryList);
      const queryInfo = {
        ...state.queryInfo,
        total: entryList.length
      };
      return {
        ...state,
        entryList,
        queryInfo
      };
    }
    case SET_QUERY:
      return {
        ...state,
        queryInfo: payload.query
      };
    case ENTRY_LOADING:
      return { ...state, ...payload };
    default:
      return state;
  }
}

export default entries;
// export default loading;
