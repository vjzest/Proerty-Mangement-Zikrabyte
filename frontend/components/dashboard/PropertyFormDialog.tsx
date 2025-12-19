"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  createProperty,
  updateProperty,
} from "@/lib/redux/features/propertySlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Loader2, X, Upload } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: any | null;
};

export function PropertyFormDialog({ open, onOpenChange, property }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.properties);
  const { user } = useSelector((state: RootState) => state.auth); // Get User Role
  const isLoading = status === "loading";

  const [formData, setFormData] = useState({
    title: "",
    type: "Residential",
    location: "",
    rent: "",
    deposit: "",
    area: "",
    googleMapsLink: "",
    features: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Helper to determine default type based on Role
  const getDefaultType = () => {
    if (user?.role === "Residential Employee") return "Residential";
    if (user?.role === "Commercial Employee") return "Commercial";
    return "Residential"; // Default for Admin
  };

  useEffect(() => {
    if (property) {
      // Edit Mode
      setFormData({
        title: property.title || "",
        type: property.type || "Residential",
        location: property.location || "",
        rent: property.rent?.toString() || "",
        deposit: property.deposit?.toString() || "",
        area: property.area || "",
        googleMapsLink: property.googleMapsLink || "",
        features: property.features?.join(", ") || "",
      });
      if (property.images && property.images.length > 0) {
        setPreviewUrls(property.images);
      } else {
        setPreviewUrls([]);
      }
    } else {
      // Create Mode - Set Type based on Role
      setFormData({
        title: "",
        type: getDefaultType(), // Auto-select type based on role
        location: "",
        rent: "",
        deposit: "",
        area: "",
        googleMapsLink: "",
        features: "",
      });
      setImageFiles([]);
      setPreviewUrls([]);
    }
  }, [property, open, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    if (index < imageFiles.length) {
      const newFiles = [...imageFiles];
      newFiles.splice(index, 1);
      setImageFiles(newFiles);
    }
    const newPreviews = [...previewUrls];
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("type", formData.type);
    data.append("location", formData.location);
    data.append("rent", formData.rent);
    data.append("deposit", formData.deposit);
    data.append("area", formData.area);
    data.append("googleMapsLink", formData.googleMapsLink);

    const featuresArray = formData.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    featuresArray.forEach((feature) => data.append("features[]", feature));

    imageFiles.forEach((file) => {
      data.append("images", file);
    });

    try {
      if (property) {
        if (property.images && property.images.length > 0) {
          data.append("existingImages", JSON.stringify(property.images));
        }
        await dispatch(
          updateProperty({ id: property._id, propertyData: data })
        ).unwrap();
      } else {
        await dispatch(createProperty(data)).unwrap();
      }
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to save property:", err);
    }
  };

  // Determine if Type select should be disabled
  // Disabled if user is NOT Admin (Employees are locked to their role)
  const isTypeDisabled = user?.role !== "Admin";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? "Edit Property" : "Add New Property"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Luxury Apartment in Bandra"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Property Type</Label>
              <Select
                value={formData.type}
                onValueChange={handleSelectChange}
                disabled={isTypeDisabled} // Lock dropdown for employees
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              {isTypeDisabled && (
                <p className="text-[10px] text-muted-foreground">
                  *Locked based on your employee role
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Area"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. 1200 sq ft"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rent">Rent (₹)</Label>
              <Input
                id="rent"
                name="rent"
                type="number"
                value={formData.rent}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit (₹)</Label>
              <Input
                id="deposit"
                name="deposit"
                type="number"
                value={formData.deposit}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapsLink">Google Maps Link</Label>
            <Input
              id="googleMapsLink"
              name="googleMapsLink"
              value={formData.googleMapsLink}
              onChange={handleChange}
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Features (Comma separated)</Label>
            <Textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="e.g. WiFi, Parking, Gym, Pool"
            />
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative">
              <input
                type="file"
                multiple
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload images (Max 10)
              </p>
            </div>

            {previewUrls.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative h-20 w-20 shrink-0">
                    <img
                      src={url}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {property ? "Update Property" : "Create Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
