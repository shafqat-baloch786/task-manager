import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api_client from '../../services/api_client';

/**
 * THUNKS (Async Logic)
 */

// 1. Register User
export const register_user = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await api_client.post('/auth/register', userData);
    return response.data; // Success message from backend
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    return thunkAPI.rejectWithValue(message);
  }
});

// 2. Login User
export const login_user = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await api_client.post('/auth/login', userData);
    if (response.data.token) {
      localStorage.setItem('user_token', response.data.token);
    }
    return response.data; // Returns { token, user }
  } catch (error) {
    const message = error.response?.data?.message || 'Invalid credentials';
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. Get User Profile (Dashboard Data)
export const get_profile = createAsyncThunk('auth/getProfile', async (_, thunkAPI) => {
  try {
    const response = await api_client.get('/dashboard'); 
    return response.data.user; 
  } catch (error) {
    // If the token is expired or invalid, the backend returns 401
    // We handle this in extraReducers to log the user out automatically
    const message = error.response?.data?.message || 'Session expired';
    return thunkAPI.rejectWithValue(message);
  }
});

/**
 * SLICE (State Management)
 */

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
    // Professional Logout: Clears everything
    logout_user: (state) => {
      localStorage.removeItem('user_token');
      state.token = null;
      state.user = null;
      state.error = null;
      state.success_msg = null;
    },
    // Helper to clear messages/errors when switching pages
    reset_auth_state: (state) => {
      state.error = null;
      state.success_msg = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /** REGISTER CASES **/
      .addCase(register_user.pending, (state) => {
        state.is_loading = true;
        state.error = null;
        state.success_msg = null;
      })
      .addCase(register_user.fulfilled, (state, action) => {
        state.is_loading = false;
        state.success_msg = action.payload.message || "Account created successfully!";
      })
      .addCase(register_user.rejected, (state, action) => {
        state.is_loading = false;
        state.error = action.payload;
      })

      /** LOGIN CASES **/
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

      /** PROFILE CASES **/
      .addCase(get_profile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(get_profile.rejected, (state) => {
        // Industry Standard: If profile fetch fails, the token is likely dead.
        // Auto-logout the user for security.
        localStorage.removeItem('user_token');
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout_user, reset_auth_state } = auth_slice.actions;
export default auth_slice.reducer;