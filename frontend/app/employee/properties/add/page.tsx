"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/lib/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    area: "",
    googleMapsLink: "",
    rent: "",
    deposit: "",
  });
  const [images, setImages] = useState<FileList | null>(null);

  // Sabse zaroori logic: role ke hisaab se type set karna
  const propertyType =
    user?.role === "Commercial Employee" ? "Commercial" : "Residential";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images) {
      alert("Please upload at least one image.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("type", propertyType);
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      await axios.post("http://localhost:5000/api/v1/properties", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/properties");
    } catch (error) {
      console.error("Failed to add property:", error);
      alert("Error adding property.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link
        href="/properties"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Properties
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Add a New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select value={propertyType} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleMapsLink">Google Maps Link</Label>
              <Input
                id="googleMapsLink"
                value={formData.googleMapsLink}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rent">Rent</Label>
                <Input
                  id="rent"
                  type="number"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Deposit</Label>
                <Input
                  id="deposit"
                  type="number"
                  value={formData.deposit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Property Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={(e) => setImages(e.target.files)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Submit Property</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
