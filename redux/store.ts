import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers_registration'
/**
 * @param {object} initialState
 */
export const makeStore = (initialState) => {
  return createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunk)))
}
