"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchDashboardStats } from "@/lib/redux/features/dashboardSlice";
import { fetchMyProperties } from "@/lib/redux/features/propertySlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Home, DollarSign, Eye, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyTypeChart } from "@/components/dashboard/PropertyTypeChart";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { stats, status: dashboardStatus } = useSelector(
    (state: RootState) => state.dashboard
  );
  const { properties, status: propertiesStatus } = useSelector(
    (state: RootState) => state.properties
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchDashboardStats());
      dispatch(fetchMyProperties()); // ✅ ERROR FIXED
    }
  }, [dispatch, user]);

  const chartData = [
    { name: "Residential", value: stats?.propertyTypeCounts?.Residential || 0 },
    { name: "Commercial", value: stats?.propertyTypeCounts?.Commercial || 0 },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (dashboardStatus === "loading" || propertiesStatus === "loading") {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-80 lg:col-span-4" />
          <Skeleton className="h-80 lg:col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalProperties || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Uploaded Today
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.propertiesUploadedToday || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Residential</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.propertyTypeCounts?.Residential || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commercial</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.propertyTypeCounts?.Commercial || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
            <CardDescription>
              Last listings added to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent properties found.
                </p>
              ) : (
                properties.map((property: any) => (
                  <div
                    key={property._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{property.title}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {property.location}
                      </div>
                    </div>
                    <div className="font-bold">
                      {formatCurrency(property.rent)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Property Type Overview</CardTitle>
            <CardDescription>Breakdown of all property types.</CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyTypeChart data={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
