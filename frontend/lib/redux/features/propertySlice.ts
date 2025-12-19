import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Property {
  _id: string;
  title: string;
  type: "Residential" | "Commercial";
  location: string;
  area: string;
  googleMapsLink: string;
  rent: number;
  deposit: number;
  features: string[];
  images: string[];
  createdBy: { _id: string; name: string; email: string; image?: string };
}

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  status: "idle",
  error: null,
  total: 0,
  page: 1,
  totalPages: 1,
};

const getAuthConfig = (
  token: string | null,
  contentType: string = "application/json"
) => {
  if (!token) throw new Error("Authentication token not found.");
  return {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": contentType },
  };
};

export const fetchAllProperties = createAsyncThunk(
  "properties/fetchAllProperties",
  async (filters: { [key: string]: any } = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/properties/public?${queryString}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch properties."
      );
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  "properties/fetchPropertyById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/properties/public/${id}`
      );
      return response.data.data.property as Property;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Property not found."
      );
    }
  }
);

export const fetchMyProperties = createAsyncThunk(
  "properties/fetchMyProperties",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/properties`,
        getAuthConfig(token)
      );
      return response.data.data.properties as Property[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch your properties."
      );
    }
  }
);

export const createProperty = createAsyncThunk(
  "properties/createProperty",
  async (propertyData: FormData, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = getAuthConfig(token, "multipart/form-data");
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/properties`,
        propertyData,
        config
      );
      return response.data.data.property as Property;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create property."
      );
    }
  }
);

export const updateProperty = createAsyncThunk(
  "properties/updateProperty",
  async (
    { id, propertyData }: { id: string; propertyData: FormData },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = getAuthConfig(token, "multipart/form-data");
      const response = await axios.patch(
        `${BACKEND_URL}/api/v1/properties/${id}`,
        propertyData,
        config
      );
      return response.data.data.property as Property;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update property."
      );
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "properties/deleteProperty",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      await axios.delete(
        `${BACKEND_URL}/api/v1/properties/${id}`,
        getAuthConfig(token)
      );
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete property."
      );
    }
  }
);

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearSelectedProperty: (state) => {
      state.selectedProperty = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: PropertyState) => {
      state.status = "loading";
      state.error = null;
    };
    const handleRejected = (state: PropertyState, action: any) => {
      state.status = "failed";
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchAllProperties.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.properties = action.payload.data.properties;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllProperties.rejected, handleRejected)
      .addCase(fetchPropertyById.pending, (state) => {
        state.status = "loading";
        state.selectedProperty = null;
      })
      .addCase(
        fetchPropertyById.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.status = "succeeded";
          state.selectedProperty = action.payload;
        }
      )
      .addCase(fetchPropertyById.rejected, handleRejected)
      .addCase(fetchMyProperties.pending, handlePending)
      .addCase(
        fetchMyProperties.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.status = "succeeded";
          state.properties = action.payload;
        }
      )
      .addCase(fetchMyProperties.rejected, handleRejected)
      .addCase(createProperty.pending, handlePending)
      .addCase(
        createProperty.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.status = "succeeded";
          state.properties.unshift(action.payload);
        }
      )
      .addCase(createProperty.rejected, handleRejected)
      .addCase(updateProperty.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateProperty.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.status = "succeeded";
          const index = state.properties.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) {
            state.properties[index] = action.payload;
          }
        }
      )
      .addCase(updateProperty.rejected, handleRejected)
      .addCase(deleteProperty.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteProperty.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.properties = state.properties.filter(
            (p) => p._id !== action.payload
          );
        }
      )
      .addCase(deleteProperty.rejected, handleRejected);
  },
});

export const { clearSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;
