import type React from "react";
import EmployeeLayoutClient from "./EmployeeLayoutClient";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["Residential Employee", "Commercial Employee"]}
    >
      <EmployeeLayoutClient>{children}</EmployeeLayoutClient>
    </ProtectedRoute>
  );
}
