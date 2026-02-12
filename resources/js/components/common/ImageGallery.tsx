import { cn } from '@/lib/utils';
import { Image } from '@/types';
import { useState } from 'react';

interface ImageGalleryProps {
  images: Image[];
  altTitle: string;
}

export default function ImageGallery({ images, altTitle }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || null);

  if (!activeImage) {
    return (
        <div className="aspect-square bg-muted flex items-center justify-center rounded-lg border">
            <span className="text-muted-foreground">No image available</span>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square w-full overflow-hidden rounded-lg border bg-muted relative group">
        <img
          src={activeImage.url}
          alt={altTitle}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
          // In a real implementation this would trigger a lightbox/dialog
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setActiveImage(image)}
              className={cn(
                "relative flex-shrink-0 cursor-pointer overflow-hidden rounded-md border text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                activeImage.id === image.id ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={image.url}
                alt={altTitle}
                className="h-20 w-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
