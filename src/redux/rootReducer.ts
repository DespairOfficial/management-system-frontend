import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import projectReducer from './slices/project';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import { tagsApi } from './api/tagsApi';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const projectPersistConfig = {
  key: 'project',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  project: persistReducer(projectPersistConfig, projectReducer),
  [tagsApi.reducerPath]: tagsApi.reducer,
});

export const middlewareArray = [
	tagsApi.middleware,
]

export default rootReducer;
