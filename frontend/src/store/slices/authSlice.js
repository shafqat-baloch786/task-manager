import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.post("/auth/login", userData);

      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

// Get profile
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/dashboard");
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Session expired"
      );
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const response = await apiClient.patch(
        "/auth/update-profile",
        userData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("userToken") || null,
    user: null,
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("userToken");
      state.token = null;
      state.user = null;
      state.error = null;
      state.successMessage = null;
    },
    resetAuthState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.isLoading = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get profile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(getProfile.rejected, (state, action) => {
        if (action.payload === "Session expired") {
          state.token = null;
          state.user = null;
          localStorage.removeItem("userToken");
        }
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
        state.successMessage =
          action.payload?.message || "Profile updated!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logoutUser, resetAuthState } = authslice.actions;
export default authslice.reducer;
