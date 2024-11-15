import React, { useRef, Suspense, useState, useCallback, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useImage } from "react-image";
import { ChevronLeftIcon, ChevronRightIcon, XIcon, ImageIcon, Loader2Icon } from "lucide-react";
import { useStore } from "../../store";

// Helper components
const ImageWithSuspense = ({
  src,
  alt,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  className: string;
  onClick: () => void;
}) => {
  const { src: loadedSrc } = useImage({
    srcList: [src],
  });
  return (
    <img src={loadedSrc} alt={alt} className={className} onClick={onClick} />
  );
};

const ImageError = () => (
  <div className="flex flex-col items-center justify-center h-full w-[250px] bg-gray-200 text-gray-400">
    <ImageIcon size={48} />
    <p className="mt-2 text-sm">Failed to load image</p>
  </div>
);

const ImageLoader = () => (
  <div className="flex items-center justify-center h-full w-[250px] bg-gray-200">
    <Loader2Icon className="animate-spin text-gray-400" size={48} />
  </div>
);

interface CustomCarouselProps {
  images: { url: string; label: string | null }[];
}

export const ImageCarousel: React.FC<CustomCarouselProps> = ({ images }) => {
    const { selectedImageModalIndex, setSelectedImageModalIndex } = useStore();
    const [imageDimensions, setImageDimensions] = useState<
      { width: number; height: number }[]
    >([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const loadImageDimensions = async () => {
        const dimensions = await Promise.all(
          images.map(
            (image) =>
              new Promise<{ width: number; height: number }>((resolve) => {
                const img = new Image();
                img.onload = () => {
                  resolve({ width: img.width, height: img.height });
                };
                img.src = `${image.url}?height=300&sharpen=true`;
              })
          )
        );
        setImageDimensions(dimensions);
      };
  
      loadImageDimensions();
    }, [images]);
  
    useEffect(() => {
      if (selectedImageModalIndex === null) return;
  
      // Preload previous and next images
      const preloadImage = (url: string) => {
        const img = new Image();
        img.src = `${url}?width=1024&sharpen=true`; // Increased width for better quality
      };
  
      const prevIndex =
        (selectedImageModalIndex - 1 + images.length) % images.length;
      const nextIndex = (selectedImageModalIndex + 1) % images.length;
  
      preloadImage(images[prevIndex].url);
      preloadImage(images[nextIndex].url);
    }, [selectedImageModalIndex, images]);
  
    const openModal = (index: number) => {
      setSelectedImageModalIndex(index);
    };
  
    const closeModal = () => {
      setSelectedImageModalIndex(null);
    };
  
    const navigateImage = (direction: "prev" | "next") => {
      if (selectedImageModalIndex === null) return;
      const newIndex =
        direction === "prev"
          ? (selectedImageModalIndex - 1 + images.length) % images.length
          : (selectedImageModalIndex + 1) % images.length;
      setSelectedImageModalIndex(newIndex);
    };
  
    const scrollCarousel = useCallback((direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount =
          direction === "left" ? -container.offsetWidth : container.offsetWidth;
        const targetScrollPosition = container.scrollLeft + scrollAmount;
  
        container.scrollTo({
          left: targetScrollPosition,
          behavior: "smooth",
        });
      }
    }, []);
  
    const containerHeight = 250; // Fixed container height
  
    return (
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollSnapType: "x mandatory",
            height: `${containerHeight}px`,
          }}
        >
          {images.map((image, index) => {
            const aspectRatio = imageDimensions[index]
              ? imageDimensions[index].width / imageDimensions[index].height
              : 1;
            const imageWidth = containerHeight * aspectRatio;
  
            return (
              <div
                key={image.url}
                className="flex-shrink-0 snap-center p-2"
                style={{
                  height: `${containerHeight}px`,
                  width: `${imageWidth}px`,
                }}
              >
                <ErrorBoundary fallback={<ImageError />}>
                  <Suspense fallback={<ImageLoader />}>
                    <ImageWithSuspense
                      src={`${image.url}?height=300&sharpen=true`}
                      alt={`Cafe Image ${index + 1}`}
                      className="h-full w-full object-cover cursor-pointer rounded-lg"
                      onClick={() => openModal(index)}
                    />
                  </Suspense>
                </ErrorBoundary>
              </div>
            );
          })}
        </div>
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
          onClick={() => scrollCarousel("left")}
        >
          <ChevronLeftIcon size={24} />
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
          onClick={() => scrollCarousel("right")}
        >
          <ChevronRightIcon size={24} />
        </button>
  
        {selectedImageModalIndex !== null && (
          <div
            className="fixed top-0 left-0 z-[1000] w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
            onClick={closeModal}
          >
            <div className="w-[90vw] h-[90vh] max-w-4xl max-h-[80vh] relative bg-black flex items-center justify-center">
              <img
                src={`${images[selectedImageModalIndex].url}?width=1024&sharpen=true`}
                alt="Expanded view"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
                loading="eager"
              />
              <button
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                onClick={closeModal}
              >
                <XIcon size={24} />
              </button>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("prev");
                }}
              >
                <ChevronLeftIcon size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("next");
                }}
              >
                <ChevronRightIcon size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };