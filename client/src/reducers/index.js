import { combineReducers } from 'redux';
import toolbar from './toolbar';
import notification from './notification';
import { authenticate, loading } from './authUserReducer';
import redirect from './redirect';

const appReducer = combineReducers({
  toolbar,
  notification,
  loading,
  authenticate,
  redirect
});

export default appReducer;
