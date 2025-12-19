"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProperty } from "@/lib/redux/features/propertySlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function AddPropertyDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { status, error } = useSelector((state: RootState) => state.properties);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    area: "",
    googleMapsLink: "",
    rent: "",
    deposit: "",
    features: "",
  });
  const [images, setImages] = useState<FileList | null>(null);

  const propertyType =
    user?.role === "Commercial Employee" ? "Commercial" : "Residential";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!images) return alert("Please upload images.");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("type", propertyType);
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    dispatch(createProperty(data)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        onOpenChange(false); // Close dialog on success
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input id="title" onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input value={propertyType} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input id="location" onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Area</Label>
              <Input id="area" onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Google Maps Link</Label>
              <Input id="googleMapsLink" onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rent</Label>
              <Input id="rent" type="number" onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Deposit</Label>
              <Input
                id="deposit"
                type="number"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Features (comma-separated)</Label>
            <Textarea id="features" onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
              required
            />
          </div>
          {status === "failed" && error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Submitting..." : "Add Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
