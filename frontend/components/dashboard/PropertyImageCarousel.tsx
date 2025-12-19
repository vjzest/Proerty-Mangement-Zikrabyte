"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image as ImageIcon } from "lucide-react";

type Props = {
  images: string[];
  title: string;
  propertyId: string;
};

export function PropertyImageCarousel({ images, title, propertyId }: Props) {
  if (!images || images.length === 0) {
    return (
      <Link href={`/properties/${propertyId}`}>
        <div className="flex items-center justify-center h-full w-full bg-muted">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
        </div>
      </Link>
    );
  }

  return (
    <Carousel className="w-full h-full">
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={index}>
            <Link href={`/properties/${propertyId}`}>
              <img
                src={img}
                alt={`${title} image ${index + 1}`}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CarouselNext className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Carousel>
  );
}
