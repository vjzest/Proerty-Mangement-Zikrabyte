import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Residential Employee" | "Commercial Employee";
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  isInitialized: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: object, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/login`,
        credentials
      );
      return { user: response.data.data.user, token: response.data.token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData: object, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/signup`,
        userData
      );
      return response.data.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async (userData: FormData, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${BACKEND_URL}/api/v1/auth/update-me`,
        userData,
        config
      );
      return response.data.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "auth/updateUserPassword",
  async (passwordData: object, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch(
        `${BACKEND_URL}/api/v1/auth/update-password`,
        passwordData,
        config
      );
      return { user: response.data.data.user, token: response.data.token };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Password update failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
    loadUserFromStorage(state) {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (user && token) {
          try {
            state.user = JSON.parse(user);
            state.token = token;
            state.status = "succeeded";
          } catch (e) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            state.user = null;
            state.token = null;
            state.status = "idle";
          }
        } else {
          state.status = "idle";
          state.user = null;
        }
        state.isInitialized = true;
      }
    },
  },
  extraReducers: (builder) => {
    const handleAuthSuccess = (
      state: AuthState,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.isInitialized = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      }
    };

    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, handleAuthSuccess)
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.token);
        }
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
