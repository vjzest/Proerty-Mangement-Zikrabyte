"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchAllProperties } from "@/lib/redux/features/propertySlice";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { MapPin, SlidersHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyImageCarousel } from "@/components/dashboard/PropertyImageCarousel";

export default function PropertiesListingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, status, total, page, totalPages } = useSelector(
    (state: RootState) => state.properties
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const PROPERTIES_PER_PAGE = 6;

  useEffect(() => {
    const filters: { [key: string]: any } = {
      sort: sortBy,
      page: currentPage,
      limit: PROPERTIES_PER_PAGE,
    };
    if (searchQuery) filters.search = searchQuery;
    if (propertyType !== "all") filters.type = propertyType;

    const handler = setTimeout(() => {
      dispatch(fetchAllProperties(filters));
    }, 500);

    return () => clearTimeout(handler);
  }, [dispatch, searchQuery, propertyType, sortBy, currentPage]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const FilterContent = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search-filter">Search</Label>
        <Input
          id="search-filter"
          placeholder="Location, title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="type-filter">Property Type</Label>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger id="type-filter" className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl mb-12">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto-format&fit=crop"
            alt="Properties Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 flex flex-col items-center justify-center p-8 md:p-16 text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Explore Premium Properties
            </h1>
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto mb-6">
              Find the perfect home from our curated collection of exclusive
              listings.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-24 shadow-sm border rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">
                  Filter Properties
                </h3>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>
          <div className="col-span-4 lg:col-span-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <p className="text-muted-foreground">
                {status === "loading"
                  ? "Searching..."
                  : `Showing ${properties.length} of ${total} results`}
              </p>
              <div className="flex w-full sm:w-auto items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden w-full">
                      <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Properties</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <FilterContent />
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button className="w-full">Apply</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-createdAt">Newest</SelectItem>
                    <SelectItem value="rent">Price: Low to High</SelectItem>
                    <SelectItem value="-rent">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {status === "loading"
                ? Array.from({ length: PROPERTIES_PER_PAGE }).map((_, i) => (
                    <Skeleton key={i} className="h-96 w-full rounded-xl" />
                  ))
                : properties.map((property: any) => (
                    <Card
                      key={property._id}
                      className="overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 ease-out border dark:border-slate-800/10 rounded-xl bg-white dark:bg-slate-900"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <PropertyImageCarousel
                          images={property.images}
                          title={property.title}
                          propertyId={property._id}
                        />
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {property.location}
                          </p>
                          <h3 className="font-bold text-lg mt-1 truncate">
                            <Link
                              href={`/properties/${property._id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {property.title}
                            </Link>
                          </h3>
                        </div>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(property.rent)}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t dark:border-slate-800">
                          <Badge
                            variant="outline"
                            className="hidden sm:inline-flex"
                          >
                            {property.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    <PaginationItem className="font-medium text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          );
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
