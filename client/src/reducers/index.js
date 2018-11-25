import { combineReducers } from 'redux';
import { authenticate, loading } from './authUserReducer';
import redirect from './redirect';
import toolbar from './toolbar';
import entries from './entries';
import profile from './profile';
import modal from './modal';
import notification from './notification';

const appReducer = combineReducers({
  loading,
  authenticate,
  toolbar,
  redirect,
  entries,
  profile,
  modal,
  notification
});

export default appReducer;
