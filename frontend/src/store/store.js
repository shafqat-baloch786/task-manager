import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth_slice';
import taskReducer from './slices/task_slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});