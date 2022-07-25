/* eslint-disable linebreak-style */
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import rootReducers from './reducers/rootReducer';

// const persistedReducer = persistReducer(persistConfig, rootReducers)
const middleware = [thunk];
const store = createStore(
  rootReducers,
  composeWithDevTools(
    applyMiddleware(...middleware)
    // other store enhancers if any
  )
);

export { store };
