import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import propertyReducer from "./features/propertySlice";
import dashboardReducer from "./features/dashboardSlice";
import employeeReducer from "./features/employeeSlice";
import inquiryReducer from "./features/inquirySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    dashboard: dashboardReducer,
    employees: employeeReducer,
    inquiries: inquiryReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
