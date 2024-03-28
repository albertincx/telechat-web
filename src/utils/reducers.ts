import { combineReducers } from 'redux'

export default function createReducer (injectedReducers = {}) {
  return combineReducers({
    ...injectedReducers,
  })
}
