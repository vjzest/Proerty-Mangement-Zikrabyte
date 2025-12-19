"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchPropertyById,
  clearSelectedProperty,
} from "@/lib/redux/features/propertySlice";
import { createInquiry } from "@/lib/redux/features/inquirySlice"; // <-- Naya action import karo
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  ChevronLeft,
  Check,
  Building,
  Home,
  Square,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function PropertyDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const propertyId = params.id as string;

  const { selectedProperty: property, status: propertyStatus } = useSelector(
    (state: RootState) => state.properties
  );
  const { status: inquiryStatus } = useSelector(
    (state: RootState) => state.inquiries
  );

  const [mainImage, setMainImage] = useState("");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyById(propertyId));
    }
    return () => {
      dispatch(clearSelectedProperty());
    };
  }, [dispatch, propertyId]);

  useEffect(() => {
    if (property) {
      if (property.images?.length > 0) {
        setMainImage(property.images[0]);
      }
      setInquiryMessage(
        `I am interested in the property "${property.title}" located at ${property.location}. Please provide more details.`
      );
    }
  }, [property]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    const inquiryData = {
      name: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone,
      message: inquiryMessage,
      propertyId: property._id,
      agentId: property.createdBy._id,
    };

    try {
      await dispatch(createInquiry(inquiryData)).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      console.error("Inquiry submission failed:", error);
      alert("Failed to send inquiry. Please try again.");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (propertyStatus === "loading" || !property) {
    return (
      <div className="bg-zinc-50 dark:bg-black">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="aspect-video w-full rounded-lg" />
              </div>
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const agent = property.createdBy;
  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "A";

  return (
    <div className="bg-zinc-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-6 -ml-3">
          <Link href="/properties">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Properties
          </Link>
        </Button>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg mb-4">
                <img
                  src={mainImage}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`aspect-video w-full overflow-hidden rounded-lg border-2 ring-offset-2 ring-offset-background focus:ring-2 focus:ring-blue-500 ${
                      mainImage === img
                        ? "border-blue-500"
                        : "border-transparent"
                    } transition-all`}
                  >
                    <img
                      src={img}
                      alt={`${property.title} thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                      {property.title}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {property.location}
                    </p>
                  </div>
                  <Badge className="text-base py-1.5 px-3 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    For Rent
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold text-lg flex items-center gap-2">
                      {property.type === "Commercial" ? (
                        <Building className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Home className="w-5 h-5 text-blue-500" />
                      )}
                      {property.type}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Area (sq ft)
                    </p>
                    <p className="font-semibold text-lg flex items-center gap-2">
                      <Square className="w-5 h-5 text-blue-500" />
                      {property.area}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-baseline gap-4 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Rent
                    </p>
                    <p className="text-4xl font-bold text-blue-600">
                      {formatCurrency(property.rent)}
                    </p>
                  </div>
                  <div className="border-l pl-4">
                    <p className="text-sm text-muted-foreground">
                      Security Deposit
                    </p>
                    <p className="text-2xl font-semibold text-muted-foreground">
                      {formatCurrency(property.deposit)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle>Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                {property.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-full">
                      <Check
                        className="w-4 h-4 text-blue-500 flex-shrink-0"
                      />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {property.googleMapsLink && (
              <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <CardTitle>Location on Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={property.googleMapsLink}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg bg-white dark:bg-slate-900 border dark:border-slate-800">
              <CardHeader className="text-center border-b dark:border-slate-800">
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                    <AvatarImage src={agent.image} />
                    <AvatarFallback className="text-xl bg-slate-200 dark:bg-slate-700">
                      {getInitials(agent.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{agent.name}</p>
                    <p className="text-sm text-blue-500 font-medium">
                      {agent.email}
                    </p>
                  </div>
                </div>

                {isSubmitted ? (
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="mx-auto h-12 w-12 mb-2" />
                    <p className="font-semibold">Inquiry Sent!</p>
                    <p className="text-sm">
                      The agent will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="Your Phone Number"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={inquiryStatus === "loading"}
                    >
                      {inquiryStatus === "loading" && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send Inquiry
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}