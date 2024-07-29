import React from "react";
import { CafeDetailedInfo } from "../types";

interface CafeImagesProps {
  cafe: CafeDetailedInfo | null;
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
  if (!cafe) return null;

  const parseImages = (imagesString: string): CafeImage[] => {
    try {
      return JSON.parse(imagesString);
    } catch (error) {
      console.error("Error parsing images:", error);
      return [];
    }
  };

  const userUploadedImages = cafe.all_image_urls || [];
  const gMapsImages = parseImages(cafe.gmaps_images as string);

  // Combine user-uploaded images with Google Maps images
  const allImages = [
    ...userUploadedImages.map(url => ({ link: url, about: "User Uploaded" })),
    ...gMapsImages
  ];

  const filterImages = (images: CafeImage[], categories: string[]) => {
    return images
      .filter((image) => categories.includes(image.about.toLowerCase().trim()))
      .slice(0, 1);
  };

  if (!expandDetails) {
    const featuredImage = allImages[0]?.link || cafe.gmaps_featured_image;
    return (
      <div className="w-full h-[200px]">
        <img
          src={featuredImage as string}
          className="w-full object-cover h-full"
          alt={cafe.name!}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {allImages.map((image, index) => (
        <ImageTile key={`image-${index}`} image={image} />
      ))}
      {filterImages(gMapsImages, ["menu"]).map((image, index) => (
        <ImageTile key={`menu-${index}`} image={image} />
      ))}
      {filterImages(gMapsImages, ["suasana"]).map((image, index) => (
        <ImageTile key={`atmosphere-${index}`} image={image} />
      ))}
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