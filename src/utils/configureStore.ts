import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createReducer from './reducers'

export default function configureStore (initialState = {}) {
  let composeEnhancers = compose
  const reduxSagaMonitorOptions = {}

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  // @ts-ignore
  if (import.meta.env.NODE_ENV !== 'production' && typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    }
  }

  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions)

  const middlewares = [sagaMiddleware]

  const enhancers = [applyMiddleware(...middlewares)]

  // @ts-ignore
  const store = createStore(
    createReducer(),
    initialState,
    // @ts-ignore
    composeEnhancers(...enhancers),
  )

  // @ts-ignore
  store.runSaga = sagaMiddleware.run
  // @ts-ignore
  store.injectedReducers = {}
  // @ts-ignore
  store.injectedSagas = {}

  return store
}
