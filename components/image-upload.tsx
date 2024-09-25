import { useState, useImperativeHandle, forwardRef, useCallback } from "react";
import Uppy, { UppyFile } from "@uppy/core";
import { useUppyEvent, Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import Pica from "pica";
import Compressor from "@uppy/compressor";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

interface ImageUploadProps {
  onFilesSelected: (files: any[]) => void;
  sessionInfo: Session;
  existingUrls?: string[];
  placeId: string; // Add this new prop
}

export interface ImageUploadRef {
  triggerUpload: () => Promise<string[]>;
}

async function isSafe(file: File) {
  return true;
  // try {
  //   const predictions = await NSFWFilter.predictImg(file, 3);
  //   const pornPrediction = predictions.find(
  //     ({ className }) => className === 'Porn'
  //   );
  //   const hentaiPrediction = predictions.find(
  //     ({ className }) => className === 'Hentai'
  //   );

  //   // Check if either Porn or Hentai probability exceeds the threshold
  //   return !(
  //     (pornPrediction && pornPrediction.probability > 0.25) ||
  //     (hentaiPrediction && hentaiPrediction.probability > 0.25)
  //   );
  // } catch (error) {
  //   console.error(error);
  //   throw error;
  // }
}

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ onFilesSelected, sessionInfo, existingUrls = [], placeId }, ref) => {
    const [uppy] = useState(() =>
      new Uppy({
        id: "imageUploader",
        autoProceed: false,
        restrictions: {
          maxNumberOfFiles: 10,
          allowedFileTypes: ["image/*"],
        },
      })
        .use(Compressor, {
          id: "compressor",
          quality: 0.6,
          limit: 10,
        })
        .use(Tus, {
          id: "tus",
          endpoint: `${
            import.meta.env.VITE_SUPABASE_URL
          }/storage/v1/upload/resumable`,
          headers: {
            authorization: `Bearer ${sessionInfo.access_token}`,
            apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          chunkSize: 6 * 1024 * 1024,
          allowedMetaFields: [
            "bucketName",
            "objectName",
            "contentType",
            "cacheControl",
          ],
        })
    );

    interface CompressedImage {
      blob: Blob;
      width: number;
      height: number;
      name: string;
    }

    const compressAndResizeImage = async (
      file: File,
      maxWidth: number,
      maxHeight: number,
      isOriginal: boolean = false
    ): Promise<CompressedImage> => {
      const pica = new Pica();
      const img = await createImageBitmap(file);

      let targetWidth = maxWidth;
      let targetHeight = maxHeight;

      if (isOriginal) {
        // For the original image, maintain aspect ratio with max height
        const aspectRatio = img.width / img.height;
        targetHeight = Math.min(maxHeight, img.height);
        targetWidth = Math.round(targetHeight * aspectRatio);

        // Ensure width doesn't exceed maxWidth
        if (targetWidth > maxWidth) {
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth / aspectRatio);
        }
      } else {
        // For non-original images, fit within the given dimensions
        const aspectRatio = img.width / img.height;
        if (aspectRatio > maxWidth / maxHeight) {
          targetHeight = Math.round(maxWidth / aspectRatio);
        } else {
          targetWidth = Math.round(maxHeight * aspectRatio);
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      await pica.resize(img, canvas, {
        filter: "mks2013",
        unsharpAmount: 160,
        unsharpRadius: 0.6,
        unsharpThreshold: 1,
      });

      // Convert canvas to blob
      const resizedBlob = await pica.toBlob(canvas, "image/webp", 0.9);

      // Generate the new file name
      const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      let newName = `${originalName}_${targetWidth}x${targetHeight}.webp`;
      if (isOriginal) {
        newName = `${originalName}.webp`;
      }

      return {
        blob: resizedBlob,
        width: targetWidth,
        height: targetHeight,
        name: newName,
      };
    };

    const handleFileAdded = useCallback(
      async (file: UppyFile<any, {}>) => {
        if (file.meta.isResizedVersion) {
          return;
        }

        const timestamp = Date.now();

        // Compress and convert original file to WebP, with a max width and height
        const originalWebp = await compressAndResizeImage(
          file.data as File,
          2048, // Max width for original image
          2048, // Max height for original image
          true
        );

        // Update the original file's data with the resized blob
        uppy.setFileState(file.id, {
          ...file,
          data: originalWebp.blob,
          name: originalWebp.name,
          size: originalWebp.blob.size,
          type: "image/webp",
          extension: "webp",
        });

        // Set metadata for the original WebP file
        uppy.setFileMeta(file.id, {
          timestamp,
          bucketName: "review-images",
          objectName: `${placeId}/${timestamp}-${originalWebp.name}`,
          cacheControl: "max-age=31536000",
          contentType: "image/webp",
        });

        // Generate resized images (unchanged)
        const resized120x120 = await compressAndResizeImage(
          file.data as File,
          120,
          120
        );
        const resized346x461 = await compressAndResizeImage(
          file.data as File,
          346,
          461
        );

        // Add resized images to Uppy (unchanged)
        [resized120x120, resized346x461].forEach((resizedFile) => {
          uppy.addFile({
            name: resizedFile.name,
            data: resizedFile.blob,
            meta: {
              isResizedVersion: true,
              timestamp,
              bucketName: "review-images",
              objectName: `${placeId}/${timestamp}-${resizedFile.name}`,
              cacheControl: "max-age=31536000",
              contentType: "image/webp",
            },
          });
        });
      },
      [placeId, uppy]
    );

    // Attach the handleFileAdded event listener
    useUppyEvent(uppy, "file-added", handleFileAdded);

    useUppyEvent(uppy, "file-added", async (file) => {
      if (file.meta.checkedNSFW) {
        // Avoid re-checking if already checked
        return;
      }

      // const isSafeImage = await checkNSFW(file);
      // if (!isSafeImage) {
      //   uppy.removeFile(file.id);
      //   return;
      // }

      // The timestamp is already set in handleFileAdded, so we don't need to set it again here
      uppy?.setFileMeta(file.id, {
        ...file.meta,
        checkedNSFW: true, // Mark as checked
      });

      onFilesSelected([file]);
    });

    uppy.on("error", (error) => {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload. Please try again.");
    });

    useImperativeHandle(ref, () => ({
      triggerUpload: async () => {
        if (!uppy) return [];

        const result = await uppy.upload();
        if (!result?.successful) {
          return [];
        }
        const newUrls = result?.successful
          .filter((file) => !file.meta.isResizedVersion) // Filter out resized versions
          .map(
            (file) =>
              `${
                import.meta.env.VITE_SUPABASE_URL
              }/storage/v1/object/public/review-images/${file.meta.objectName}`
          );
        return newUrls;
      },
    }));

    return (
      <Dashboard
        uppy={uppy as any}
        hideUploadButton={true}
        height={200}
        metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
        showProgressDetails={true}
        proudlyDisplayPoweredByUppy={false}
        showSelectedFiles={false}
      />
    );
  }
);
