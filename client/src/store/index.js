import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from '../reducers';

let enhancer;
if (process.env.NODE_ENV === 'prod') {
  enhancer = applyMiddleware(thunk);
} else {
  enhancer = composeWithDevTools(applyMiddleware(thunk));
}

const store = createStore(reducer, enhancer);

export default store;
