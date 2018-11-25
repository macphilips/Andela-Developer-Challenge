import { combineReducers } from 'redux';
import { authenticate, loading } from './authUserReducer';
import redirect from './redirect';
import toolbar from './toolbar';
import entries from './entries';
import modal from './modal';
import notification from './notification';

const appReducer = combineReducers({
  loading,
  authenticate,
  toolbar,
  redirect,
  entries,
  modal,
  notification
});

export default appReducer;
