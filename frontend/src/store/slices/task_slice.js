import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api_client from '../../services/api_client';

/**
 * THUNKS (Async Logic for Backend operations)
 */

// 1. Fetch All Tasks (Matches router.get('/') and controller tasks)
export const fetch_tasks = createAsyncThunk('tasks/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await api_client.get('/tasks');
    // Your backend returns { getTasks: [...] }
    return response.data.getTasks;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load tasks');
  }
});

// 2. Create Task (Matches router.post('/create') and controller create_task)
export const add_task = createAsyncThunk('tasks/add', async (taskData, thunkAPI) => {
  try {
    const response = await api_client.post('/tasks/create', taskData);
    // Your backend returns { task: {...}, message: "..." }
    return response.data.task;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create task');
  }
});

// 3. Update/Edit Task (Matches router.patch('/:id') and controller editTask)
export const update_task = createAsyncThunk('tasks/update', async ({ id, updates }, thunkAPI) => {
  try {
    const response = await api_client.patch(`/tasks/${id}`, updates);
    // Your backend returns { task: {...}, message: "..." }
    return response.data.task;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
  }
});

// 4. Delete Task (Matches router.delete('/:id') and controller deleteTask)
export const remove_task = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
  try {
    await api_client.delete(`/tasks/${id}`);
    return id; // Return the ID so we can remove it from local state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
  }
});

/**
 * SLICE (State Management)
 */

const task_slice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    is_loading: false,
    error: null,
  },
  reducers: {
    // Standard reducer to clear error if needed
    clear_task_error: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /** FETCH ALL CASES **/
      .addCase(fetch_tasks.pending, (state) => {
        state.is_loading = true;
        state.error = null;
      })
      .addCase(fetch_tasks.fulfilled, (state, action) => {
        state.is_loading = false;
        state.items = action.payload;
      })
      .addCase(fetch_tasks.rejected, (state, action) => {
        state.is_loading = false;
        state.error = action.payload;
      })

      /** ADD TASK CASES **/
      .addCase(add_task.fulfilled, (state, action) => {
        // Industry standard: add the new task to the top of the array
        state.items.unshift(action.payload);
      })

      /** UPDATE TASK CASES **/
      .addCase(update_task.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      /** DELETE TASK CASES **/
      .addCase(remove_task.fulfilled, (state, action) => {
        // Remove the task from the local state list immediately
        state.items = state.items.filter(task => task._id !== action.payload);
      });
  },
});

export const { clear_task_error } = task_slice.actions;
export default task_slice.reducer;