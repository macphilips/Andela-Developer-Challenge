import { combineReducers } from 'redux';
import toolbar from './toolbar';
import notification from './notification';
import { authenticate, loading } from './authUserReducer';

const appReducer = combineReducers({
  toolbar,
  notification,
  loading,
  authenticate
});

export default appReducer;
