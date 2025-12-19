"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchAllProperties } from "@/lib/redux/features/propertySlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Users,
  MapPin,
  Square,
  ShieldCheck,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, status } = useSelector(
    (state: RootState) => state.properties
  );

  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchAllProperties({ sort: "-createdAt", limit: 6 }));
  }, [dispatch]);

  useEffect(() => {
    if (!properties.length) return;
    const interval = setInterval(() => {
      setCurrentPropertyIndex((prev) =>
        prev === properties.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [properties.length]);

  const nextProperty = () => {
    setCurrentPropertyIndex((prev) =>
      prev === properties.length - 1 ? 0 : prev + 1
    );
  };

  const prevProperty = () => {
    setCurrentPropertyIndex((prev) =>
      prev === 0 ? properties.length - 1 : prev - 1
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getVisibleProperties = () => {
    if (properties.length === 0) return [];
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentPropertyIndex + i) % properties.length;
      visible.push(properties[index]);
    }
    return visible;
  };

  return (
    <div className="bg-white dark:bg-slate-950">
      <Navbar />
      <main>
        <section className="relative h-[85vh] sm:h-[90vh] min-h-[600px] sm:min-h-[700px] flex items-center justify-center text-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto-format&fit=crop"
              alt="Luxury home background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 container mx-auto px-3 sm:px-4 flex flex-col items-center">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-balance leading-tight mb-4 sm:mb-6 text-shadow-lg px-2">
              Find Your Next Chapter
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto text-balance mb-6 sm:mb-10 px-4">
              Discover exclusive properties, apartments, and villas with the
              city's most trusted real estate platform.
            </p>
            <Card className="w-full max-w-5xl p-3 sm:p-4 md:p-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl sm:rounded-2xl mx-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 items-center">
                <div className="sm:col-span-2">
                  <Input
                    placeholder="Enter location or city"
                    className="bg-white/90 dark:bg-slate-800/50 border-0 text-slate-900 dark:text-white placeholder:text-slate-500 h-12 sm:h-14 md:h-16 text-sm sm:text-base rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
                <div>
                  <Select>
                    <SelectTrigger className="bg-white/90 dark:bg-slate-800/50 border-0 text-slate-900 dark:text-white h-12 sm:h-14 md:h-16 text-sm sm:text-base rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select>
                    <SelectTrigger className="bg-white/90 dark:bg-slate-800/50 border-0 text-slate-900 dark:text-white h-12 sm:h-14 md:h-16 text-sm sm:text-base rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500">
                      <SelectValue placeholder="Budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Under ₹50K</SelectItem>
                      <SelectItem value="2">₹50K - ₹1L</SelectItem>
                      <SelectItem value="3">₹1L+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="lg"
                  className="h-12 sm:h-14 md:h-16 w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 rounded-lg shadow-lg"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Search</span>
                  <span className="sm:hidden">Find</span>
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section
          id="featured"
          className="py-12 sm:py-16 md:py-24 lg:py-32 bg-zinc-50 dark:bg-black"
        >
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-slate-900 dark:text-slate-100">
                Featured Properties
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Handpicked selection of the finest properties in prime
                locations.
              </p>
            </div>

            {status === "loading" ? (
              <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-[400px] sm:h-[450px] w-full rounded-xl sm:rounded-2xl"
                  />
                ))}
              </div>
            ) : (
              <div className="relative group">
                <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {properties[currentPropertyIndex] && (
                    <div className="md:hidden">
                      <PropertyCard
                        property={properties[currentPropertyIndex]}
                        formatCurrency={formatCurrency}
                      />
                    </div>
                  )}

                  {getVisibleProperties().map((property: any) => (
                    <div key={property._id} className="hidden md:block">
                      <PropertyCard
                        property={property}
                        formatCurrency={formatCurrency}
                      />
                    </div>
                  ))}
                </div>

                {properties.length > 1 && (
                  <>
                    <button
                      onClick={prevProperty}
                      className="absolute left-0 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Previous property"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={nextProperty}
                      className="absolute right-0 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Next property"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                  {properties.map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPropertyIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        currentPropertyIndex === i
                          ? "w-8 bg-blue-500"
                          : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to property ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="text-center mt-8 sm:mt-12">
              <Button
                asChild
                size="lg"
                className="rounded-full font-semibold px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base"
              >
                <Link href="/properties">
                  View All Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
                <img
                  src="https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1958&auto-format&fit=crop"
                  alt="Modern house interior"
                  className="w-full"
                />
              </div>
              <div className="order-1 lg:order-2">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800 mb-4 sm:mb-5 text-xs sm:text-sm">
                  Why Choose EstateHub
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
                  Your Trusted Partner in Real Estate
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-10 text-balance">
                  We provide a seamless property buying experience with our
                  expert guidance, verified listings, and data-driven insights.
                </p>
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-1">
                        100% Verified Properties
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Every listing on our platform is thoroughly vetted for
                        quality and legal clearance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-1">
                        Top-Rated Expert Agents
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Connect with our network of professional agents who
                        guide you at every step.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-zinc-50 dark:bg-black">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                What Our Clients Say
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Real stories from people who found their dream homes with us.
              </p>
            </div>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                name="Rahul Kumar"
                location="Home Buyer, Mumbai"
                text="EstateHub's platform is incredibly user-friendly. We found our perfect family home in just a few weeks."
              />
              <TestimonialCard
                name="Priya Sharma"
                location="Investor, Bangalore"
                text="Professional service and genuine listings. I found the perfect investment property within weeks. Highly recommended!"
              />
              <TestimonialCard
                name="Amit Mehta"
                location="Seller, Delhi"
                text="The best real estate platform I've used. Great selection of properties and transparent pricing."
              />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-slate-900 text-white dark:bg-slate-950">
          <div className="container mx-auto px-3 sm:px-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-balance px-4">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-10 px-4">
              Let's get started. Browse our listings or get in touch with an
              agent today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-slate-900 hover:bg-slate-200 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-full shadow-lg"
              >
                <Link href="/properties">Explore Listings</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-slate-500 text-white hover:bg-slate-800 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-full bg-transparent"
              >
                <Link href="/contact">Contact an Agent</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function PropertyCard({ property, formatCurrency }: any) {
  return (
    <Card className="overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 ease-out border dark:border-slate-800 rounded-xl sm:rounded-2xl">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 sm:top-4 left-3 sm:left-4 text-white border-0 shadow-md bg-blue-600 text-xs sm:text-sm"
        >
          For Rent
        </Badge>
      </div>
      <CardContent className="p-4 sm:p-6 bg-background">
        <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 mb-2 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mb-3 sm:mb-4 line-clamp-1">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
          {property.location}
        </p>
        <div className="flex items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground py-3 sm:py-4 border-y dark:border-slate-800">
          <span className="flex items-center gap-2 font-medium">
            <Square className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
            {property.area} sqft
          </span>
        </div>
        <div className="mt-4 sm:mt-5 flex justify-between items-center gap-3">
          <div>
            <p className="text-xs sm:text-sm text-slate-500">Rent</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(property.rent)}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full font-semibold text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
          >
            <Link href={`/properties/${property._id}`}>
              View <span className="hidden sm:inline ml-1">Details</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-1.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ name, location, text }: any) {
  return (
    <Card className="p-6 sm:p-8 bg-background shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl sm:rounded-2xl">
      <div className="flex gap-1 mb-3 sm:mb-4">
        {[...Array(5)].map((_, j) => (
          <Star
            key={j}
            className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400"
          />
        ))}
      </div>
      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
        "{text}"
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-3 sm:pt-4 border-t dark:border-slate-800">
        <div className="font-semibold text-sm sm:text-base">{name}</div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {location}
        </div>
      </div>
    </Card>
  );
}
