// @flow
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, routerActions, routerReducer as router } from 'react-router-redux';
import { reduxBatch } from '@manaflair/redux-batch';

import { BehaviorSubject } from 'rxjs';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import { noteReducer } from './note';
import { appStart } from './actions/core';

export const sagaMiddleware = createSagaMiddleware();
export const sagas = [];

const rootEpic = new BehaviorSubject(combineEpics());
const epicMiddleware = createEpicMiddleware((action, store) => rootEpic.mergeMap(epic => epic(action, store)));
const context = require.context('./epics', true, /\.js$/);
context.keys().forEach(key => {
  const epicToLoad = context(key).default;
  rootEpic.next(epicToLoad);
});

export const rootReducer = combineReducers({
  router,
});

export const history = createHistory();

export const configureStore = () => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // workers for hard calc
  // middleware.push(workerMiddleware);

  // Router Middleware
  middleware.push(routerMiddleware(history));

  // redux-saga
  middleware.push(sagaMiddleware);

  // empty redux-observable
  middleware.push(epicMiddleware);

  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actionCreators,
    })
    : compose;

  // Apply Middleware & Compose Enhancers
  enhancers.push(reduxBatch);
  enhancers.push(applyMiddleware(...middleware));
  enhancers.push(reduxBatch);
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, enhancer);

  return store;
};

export const store = configureStore();

store.dispatch(appStart());
