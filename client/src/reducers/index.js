import { combineReducers } from 'redux';
import toolbar from './toolbar';
import notification from './notification';

const appReducer = combineReducers({
  toolbar,
  notification
});

export default appReducer;
