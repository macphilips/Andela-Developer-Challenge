import { apiRequest } from '../services/index';
import { dismissModal } from './modal';
import { showToast } from './notification';

export const SET_QUERY = 'SET QUERY';

export const ADD_ENTRY = 'ADD ENTRY';
export const ENTRY_LOADING = 'ENTRY_LOADING';
export const REMOVE_ENTRY = 'REMOVE ENTRY';
export const SET_ENTRIES = 'SET ENTRIES';
export const UPDATE_ENTRY = 'UPDATE ENTRIES';

export const requesting = loading => ({
  type: ENTRY_LOADING,
  loading
});

/**
 *
 * @returns {{type: string, entryList: Array<object>}}
 * @param entryList
 */
export const setEntries = entryList => ({
  type: SET_ENTRIES,
  entryList,
});

/**
 *
 * @returns {{type: string, entry: object}}
 * @param entry
 */
export const addEntry = entry => ({
  type: ADD_ENTRY,
  entry,
});

/**
 *
 * @returns {{type: string, entry: object}}
 * @param entry
 */
export const updateEntries = entry => ({
  type: UPDATE_ENTRY,
  entry,
});

/**
 *
 * @param {number} page
 * @param {number} size
 * @param {number} total
 * @return {
 *          {
 *            type: string,
 *            query: {
 *              page: number, size: number, total: number
 *            }
 *          }
 *         }
 */
export const setQuery = ({ page, size, total }) => ({
  type: SET_QUERY,
  query: {
    page: Number(page),
    size: Number(size),
    total: Number(total)
  },
});

/**
 *
 * @returns {{type: string, entry: object}}
 * @param id
 */
export const removeEntry = id => ({
  type: REMOVE_ENTRY,
  id,
});

export const DEFAULT_SIZE = 5;
export const getEntries = query => async (dispatch) => {
  try {
    const result = await apiRequest.getEntries(query);
    const { size } = query;
    const { data } = result;
    const { entries, page, totalEntries: total } = data;
    dispatch(setEntries(entries));
    dispatch(setQuery({
      page,
      total,
      size: size || DEFAULT_SIZE
    }));
  } catch (e) {
    dispatch(setEntries([]));
    dispatch(showToast({
      type: 'error',
      text: e.message,
      timeout: 5000
    }));
  }
};

export const updateEntry = (id, data) => async (dispatch) => {
  try {
    dispatch(requesting(true));
    const result = await apiRequest.updateEntry(id, data);
    dispatch(requesting(false));
    dispatch(updateEntries(result.entry));
    dispatch(dismissModal());
  } catch (error) {
    dispatch(requesting(false));
    dispatch(showToast({
      type: 'error',
      text: ''
    }));
  }
};

export const createEntry = details => async (dispatch) => {
  try {
    dispatch(requesting(true));
    const result = await apiRequest.createEntry(details);
    dispatch(requesting(false));
    dispatch(addEntry(result.entry));
    dispatch(dismissModal());
  } catch (error) {
    dispatch(requesting(false));
    dispatch(showToast({
      type: 'error',
      text: ''
    }));
  }
};

export const deleteEntry = id => async (dispatch) => {
  try {
    dispatch(requesting(true));
    await apiRequest.deleteEntry(id);
    dispatch(requesting(false));
    dispatch(dismissModal());
    dispatch(removeEntry(id));
  } catch (error) {
    dispatch(requesting(false));
    dispatch(showToast({
      type: 'error',
      text: error.message
    }));
  }
};
