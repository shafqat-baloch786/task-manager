import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api_client from '../../services/api_client';

export const register_user = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await api_client.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const login_user = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await api_client.post('/auth/login', userData);
    if (response.data.token) {
      localStorage.setItem('user_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Invalid credentials');
  }
});

export const get_profile = createAsyncThunk('auth/getProfile', async (_, thunkAPI) => {
  try {
    const response = await api_client.get('/dashboard'); 
    return response.data.user; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Session expired');
  }
});

export const update_profile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  try {
    const response = await api_client.patch('/auth/update-profile', userData);
    return response.data; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
  }
});

const auth_slice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('user_token') || null,
    user: null,
    is_loading: false,
    error: null,
    success_msg: null,
  },
  reducers: {
    logout_user: (state) => {
      localStorage.removeItem('user_token');
      state.token = null;
      state.user = null;
      state.error = null;
      state.success_msg = null;
    },
    reset_auth_state: (state) => {
      state.error = null;
      state.success_msg = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register_user.fulfilled, (state, action) => {
        state.success_msg = action.payload.message;
        state.is_loading = false;
      })
      // Login
      .addCase(login_user.pending, (state) => {
        state.is_loading = true;
        state.error = null;
      })
      .addCase(login_user.fulfilled, (state, action) => {
        state.is_loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login_user.rejected, (state, action) => {
        state.is_loading = false;
        state.error = action.payload;
      })
      // Profile
      .addCase(get_profile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.is_loading = false;
      })
      .addCase(get_profile.rejected, (state, action) => {
        if (action.payload === 'Session expired') {
          state.token = null;
          state.user = null;
          localStorage.removeItem('user_token');
        }
      })
      // Update
      .addCase(update_profile.pending, (state) => {
        state.error = null;
        state.success_msg = null;
      })
      .addCase(update_profile.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
        state.success_msg = action.payload?.message || "Profile updated!";
      })
      .addCase(update_profile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout_user, reset_auth_state } = auth_slice.actions;
export default auth_slice.reducer;