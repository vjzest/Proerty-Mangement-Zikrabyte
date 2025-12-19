import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property: { _id: string; title: string; location: string };
  agent: { _id: string; name: string; email: string };
  status: "New" | "Contacted" | "Closed";
  createdAt: string;
}

interface InquiryState {
  inquiries: Inquiry[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InquiryState = {
  inquiries: [],
  status: "idle",
  error: null,
};

const getAuthConfig = (token: string | null) => {
  if (!token) throw new Error("Authentication token not found.");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const createInquiry = createAsyncThunk(
  "inquiries/createInquiry",
  async (inquiryData: object, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/inquiries`,
        inquiryData
      );
      return response.data.data.inquiry;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send inquiry."
      );
    }
  }
);

export const fetchInquiries = createAsyncThunk(
  "inquiries/fetchInquiries",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/inquiries`,
        getAuthConfig(token)
      );
      return response.data.data.inquiries as Inquiry[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch inquiries."
      );
    }
  }
);

const inquirySlice = createSlice({
  name: "inquiries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchInquiries.fulfilled,
        (state, action: PayloadAction<Inquiry[]>) => {
          state.status = "succeeded";
          state.inquiries = action.payload;
        }
      )
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createInquiry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createInquiry.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default inquirySlice.reducer;
