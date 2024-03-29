import { applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createReducer from './reducers'

import { configureStore } from '@reduxjs/toolkit'

export default function configure () {
  const reduxSagaMonitorOptions = {}

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions)

  const middlewares = [sagaMiddleware]

  // @ts-ignore
  const store = configureStore({
    reducer: createReducer(),
    // @ts-ignore
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat([applyMiddleware(...middlewares)]),
  },
    // createReducer(),
    // @ts-ignore
    // initialState,
    // @ts-ignore
    // composeEnhancers(...enhancers),
  )

  // @ts-ignore
  store.runSaga = sagaMiddleware.run
  // @ts-ignore
  store.injectedReducers = {}
  // @ts-ignore
  store.injectedSagas = {}

  return store
}
