import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface DashboardStats {
  totalProperties: number;
  propertiesUploadedToday: number;
  propertyTypeCounts: {
    Residential: number;
    Commercial: number;
  };
}

interface DashboardState {
  stats: DashboardStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  status: "idle",
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      if (!token) {
        return rejectWithValue("Authentication token not found.");
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/dashboard/stats`,
        config
      );
      return response.data.data.stats as DashboardStats;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard stats."
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.status = "succeeded";
          state.stats = action.payload;
        }
      )
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
