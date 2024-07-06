// components/CafeImages.tsx
import React from "react";
import { Database } from "./lib/database.types";

interface CafeImagesProps {
  cafe: Database["public"]["Tables"]["cafes"]["Row"]; // Replace 'any' with a proper type for your cafe object
  expandDetails: boolean;
}

interface CafeImage {
  about: string;
  link: string;
}

export const CafeImages: React.FC<CafeImagesProps> = ({
  cafe,
  expandDetails,
}) => {
  const parseImages = (imagesString: string) => {
    try {
      return JSON.parse(imagesString);
    } catch (error) {
      console.error("Error parsing images:", error);
      return [];
    }
  };

  const filterImages = (images: CafeImage[], categories: string[]) => {
    return images
      .filter((image) => categories.includes(image.about.toLowerCase().trim()))
      .slice(0, 1);
  };

  const images = parseImages(cafe.gmaps_images as string);

  if (!expandDetails) {
    return (
      <div className="w-full h-[200px]">
        <img
          src={cafe.gmaps_featured_image as string}
          className="w-full object-cover h-full"
          alt={cafe.name}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {filterImages(images, ["semua", "oleh pemilik", "terbaru"]).map(
        (image: CafeImage, index: number) => (
          <ImageTile key={`atmosphere-${index}`} image={image} />
        )
      )}
      {filterImages(images, ["menu"]).map((image: CafeImage, index: number) => (
        <ImageTile key={`menu-${index}`} image={image} />
      ))}
      {filterImages(images, ["suasana"]).map(
        (image: CafeImage, index: number) => (
          <ImageTile key={`other-${index}`} image={image} />
        )
      )}
    </div>
  );
};

interface ImageTileProps {
  image: {
    link: string;
    about: string;
  };
}

const ImageTile: React.FC<ImageTileProps> = ({ image }) => (
  <div className="relative overflow-hidden rounded-md ring-1 ring-slate-950 shadow-sm">
    <img
      src={image.link}
      className="w-full h-full object-cover"
      alt={image.about}
    />
    <div className="z-10 bg-slate-900 text-slate-100 rounded-sm font-bold p-1 absolute top-1 left-1">
      {image.about}
    </div>
  </div>
);
