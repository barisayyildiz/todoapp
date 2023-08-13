import { configureStore, combineReducers } from '@reduxjs/toolkit';
import todos from './todos';
import filter from './filter'

const rootReducer = combineReducers({
  todos,
  filter
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;

export default store;
