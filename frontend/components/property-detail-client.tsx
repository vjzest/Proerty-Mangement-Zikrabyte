"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Share2, Check, Mail, Phone, User, ChevronLeft, ChevronRight } from "lucide-react"

type Property = {
  id: string
  title: string
  location: string
  fullAddress: string
  price: number
  type: string
  status: string
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  yearBuilt: number
  description: string
  images: string[]
  amenities: string[]
  features: string[]
}

export default function PropertyDetailClient({ property }: { property: Property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to your backend API
    console.log("Inquiry submitted")
    setIsInquirySubmitted(true)
    setTimeout(() => setIsInquirySubmitted(false), 3000)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  return (
    <div className="relative">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Image Gallery - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
            <img
              src={property.images[currentImageIndex] || "/placeholder.svg"}
              alt={property.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border-0"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border-0"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-xl flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-xl flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all transform hover:scale-105 ${
                  currentImageIndex === index
                    ? "border-blue-500 shadow-lg shadow-blue-500/50 ring-2 ring-blue-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`View ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                {currentImageIndex === index && <div className="absolute inset-0 bg-blue-500/20" />}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 mt-6 lg:mt-0">
          <Card className="sticky top-24 border-0 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Interested in this property?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Fill out the form below and our team will get back to you shortly.
              </p>

              {isInquirySubmitted ? (
                <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/50 animate-in zoom-in duration-500">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                  <p className="text-sm text-muted-foreground">We'll contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="I'm interested in this property..."
                      rows={4}
                      defaultValue={`I'm interested in ${property.title}. Please contact me with more details.`}
                      className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                    size="lg"
                  >
                    Send Inquiry
                  </Button>

                  <p className="text-xs text-center text-muted-foreground pt-2">
                    By submitting, you agree to our{" "}
                    <a href="/terms" className="text-blue-600 hover:underline">
                      Terms
                    </a>{" "}
                    &{" "}
                    <a href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
