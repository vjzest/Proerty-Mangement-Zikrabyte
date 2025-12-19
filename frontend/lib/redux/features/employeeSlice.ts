import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "Residential Employee" | "Commercial Employee";
  image?: string;
}

interface Stats {
  totalProperties: number;
  activeListings: number;
  totalRevenue: number;
}

interface EmployeeState {
  employees: Employee[];
  dashboardStats: Stats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  dashboardStats: null,
  status: "idle",
  error: null,
};

const getAuthConfig = (token: string | null) => {
  if (!token) throw new Error("Authentication token not found.");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/users`,
        getAuthConfig(token)
      );
      return response.data.data as Employee[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  }
);

export const fetchEmployeeStats = createAsyncThunk(
  "employees/fetchEmployeeStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/users/me/stats`,
        getAuthConfig(token)
      );
      return response.data.data.stats as Stats;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (employeeData: FormData, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/users`,
        employeeData,
        config
      );
      return response.data.data as Employee;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to add");
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (
    { id, data }: { id: string; data: FormData },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${BACKEND_URL}/api/v1/users/${id}`,
        data,
        config
      );
      return response.data.data as Employee;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update");
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      await axios.delete(
        `${BACKEND_URL}/api/v1/users/${id}`,
        getAuthConfig(token)
      );
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete");
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(
          (emp) => emp._id === action.payload._id
        );
        if (index !== -1) state.employees[index] = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(
          (emp) => emp._id !== action.payload
        );
      })
      .addCase(fetchEmployeeStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployeeStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardStats = action.payload;
      })
      .addCase(fetchEmployeeStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;
