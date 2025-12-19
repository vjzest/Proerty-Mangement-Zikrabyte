"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchMyProperties,
  deleteProperty,
} from "@/lib/redux/features/propertySlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Image as ImageIcon,
  Building,
  Home as HomeIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PropertyFormDialog } from "@/components/dashboard/PropertyFormDialog";

type Property = {
  _id: string;
  title: string;
  type: string;
  location: string;
  images: string[];
  rent: number;
  deposit: number;
  features: string[];
  createdBy: { _id: string; name: string; email: string; image?: string };
};

export default function PropertiesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { properties, status, error } = useSelector(
    (state: RootState) => state.properties
  );
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    if (token) {
      dispatch(fetchMyProperties());
    } else if (status !== "loading") {
      router.push("/login");
    }
  }, [dispatch, token, router]);

  const filteredProperties = properties.filter((property: any) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleOpenDialog = (property: Property | null = null) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteProperty(id));
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const isAdmin = user?.role === "Admin";
  const pageTitle = isAdmin ? "All Properties" : "My Properties";

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "failed" && error)
    return (
      <div className="text-center py-10 text-destructive">
        Error: {error}. Please refresh or login again.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">
            Manage and view all property listings.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shrink-0">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-muted/40">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="w-full sm:w-56">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-background">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[350px]">Property Details</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pricing</TableHead>
                {isAdmin && <TableHead>Created By</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 5 : 4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No properties found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property: any) => (
                  <TableRow key={property._id} className="hover:bg-muted/5">
                    <TableCell>
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold leading-none text-base">
                            {property.title}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3.5 w-3.5" />
                            <span className="truncate max-w-[200px]">
                              {property.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          property.type === "Commercial"
                            ? "secondary"
                            : "default"
                        }
                        className="gap-1.5 py-1 px-2.5"
                      >
                        {property.type === "Commercial" ? (
                          <Building className="w-3.5 h-3.5" />
                        ) : (
                          <HomeIcon className="w-3.5 h-3.5" />
                        )}
                        {property.type}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-base">
                          {formatCurrency(property.rent)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Dep: {formatCurrency(property.deposit)}
                        </span>
                      </div>
                    </TableCell>

                    {isAdmin && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage
                              src={property.createdBy?.image}
                              alt={property.createdBy?.name}
                            />
                            <AvatarFallback>
                              {getInitials(property.createdBy?.name || "?")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {property.createdBy?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground hidden lg:block">
                              {property.createdBy?.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(property)}
                          >
                            Edit Details
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive focus:text-destructive"
                              >
                                Delete Property
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Property?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove "{property.title}
                                  " from the database. This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(property._id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <PropertyFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        property={editingProperty}
      />
    </div>
  );
}
