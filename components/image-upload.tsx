// ImageUpload.tsx

import { Session } from "@supabase/supabase-js";
import Uppy, { UppyFile } from "@uppy/core";
import useUppyEvent from "@uppy/react/lib/useUppyEvent";
import XHRUpload from "@uppy/xhr-upload";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-wasm";
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./lib/database.types";
import Pica from "pica";

import "@uppy/core/dist/style.min.css";
import StatusBar from "@uppy/react/lib/StatusBar";

const MAX_WIDTH = 1200; // Maximum width for resized images
const MAX_HEIGHT = 1200; // Maximum height for resized images

interface ImageUploadProps {
  sessionInfo: Session;
  placeId: string;
  onUploadStart: () => void;
  onUploadComplete: () => void;
  uppy: Uppy<ExtendedMetadata>;
}

export type ExtendedMetadata = {
  classification?: string;
  placeId: string;
  reviewId?: string;
  label?: string;
};

type ExtendedUppyFile = UppyFile<ExtendedMetadata, any>;

export const ImageUpload = ({
  placeId,
  onUploadStart,
  onUploadComplete,
  uppy,
}: ImageUploadProps) => {
  const [pica] = useState(() => new Pica());

  const [modelLoading, setModelLoading] = useState(true);
  const workerRef = useRef<Worker | null>(null);
  const classificationQueue = useRef<
    Array<{ file: ExtendedUppyFile; resolve: (value: any) => void }>
  >([]);

  useEffect(() => {
    async function setupWasm() {
      try {
        setWasmPaths(
          "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.0.0/dist/"
        );
        await tf.setBackend("wasm");
        await tf.ready();
        console.log("WASM backend set up, current backend:", tf.getBackend());
      } catch (error) {
        console.error("Error setting up WASM backend:", error);
        toast.error(
          "Failed to set up image processing. Some features may not work."
        );
      }
    }

    setupWasm().then(() => {
      if (!workerRef.current) {
        workerRef.current = new Worker(
          new URL("./lib/model-worker.ts", import.meta.url),
          { type: "module" }
        );

        workerRef.current.onmessage = (event) => {
          if (event.data.type === "modelLoaded") {
            setModelLoading(false);
            processQueue();
          } else if (event.data.type === "setupError") {
            toast.error("Failed to load the image classification model.");
            setModelLoading(false);
          } else if (event.data.type === "predictionResult") {
            const { prediction, fileId } = event.data;
            console.log("Image classification results:", prediction);
            // Update the file metadata with the prediction
            uppy.setFileMeta(fileId, {
              ...uppy.getFile(fileId)?.meta,
              classification: prediction,
            });
          } else if (event.data.type === "predictionError") {
            toast.error("An error occurred during image classification.");
          }
        };

        workerRef.current.postMessage({ type: "loadModel" });
      }
    });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processQueue = () => {
    while (classificationQueue.current.length > 0) {
      const { file, resolve } = classificationQueue.current.shift()!;
      runPrediction(file).then(resolve);
    }
  };

  const runPrediction = async (file: ExtendedUppyFile) => {
    if (!workerRef.current) {
      console.warn("Worker not initialized");
      return null;
    }

    const fileData = file.data as File;

    const img = new Image();
    img.src = URL.createObjectURL(fileData);
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    const imageData = ctx?.getImageData(0, 0, img.width, img.height);

    return new Promise((resolve) => {
      if (workerRef.current) {
        const messageHandler = (event: MessageEvent) => {
          if (event.data.type === "predictionResult") {
            console.log("Prediction result:", event.data.prediction);
            resolve(event.data.prediction);
            workerRef.current?.removeEventListener("message", messageHandler);
          } else if (event.data.type === "predictionError") {
            console.error("Prediction error:", event.data.error);
            resolve(null);
            workerRef.current?.removeEventListener("message", messageHandler);
          }
        };

        workerRef.current.addEventListener("message", messageHandler);

        workerRef.current.postMessage({
          type: "runPrediction",
          imageData,
          fileId: file.id,
        });
      } else {
        resolve(null);
      }
    });
  };

  const resizeImage = async (file: File): Promise<Blob> => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => (img.onload = resolve));

    const aspectRatio = img.width / img.height;
    let newWidth = img.width;
    let newHeight = img.height;

    if (newWidth > MAX_WIDTH) {
      newWidth = MAX_WIDTH;
      newHeight = newWidth / aspectRatio;
    }

    if (newHeight > MAX_HEIGHT) {
      newHeight = MAX_HEIGHT;
      newWidth = newHeight * aspectRatio;
    }

    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;

    await pica.resize(img, canvas, {
      unsharpAmount: 160,
      unsharpRadius: 0.6,
      unsharpThreshold: 1,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, file.type);
    });
  };

  useUppyEvent(uppy, "file-added", async (file: ExtendedUppyFile) => {
    let prediction;
    if (!modelLoading) {
      prediction = await runPrediction(file);
    } else {
      prediction = await new Promise((resolve) => {
        classificationQueue.current.push({ file, resolve });
      });
    }

    const bestPrediction = (
      prediction as { probability: number; className: string }[]
    )?.find((p) => p.probability > 0.7);

    if (bestPrediction) {
      uppy.setFileMeta(file.id, {
        ...file.meta,
        classification: bestPrediction.className,
      });
    }
  });

  uppy.on("error", (error) => {
    console.error("Upload error:", error);
    toast.error("An error occurred during upload. Please try again.");
  });

  const startUpload = useCallback(
    async (reviewId: string) => {
      if (!uppy) return;
      onUploadStart();

      uppy.getFiles().forEach((file) => {
        const classification = file.meta.classification;
        uppy.setFileMeta(file.id, {
          label: classification,
          placeId,
          reviewId,
        });
      });

      const result = await uppy.upload();
      if (result?.successful) {
        onUploadComplete();
      }
    },
    [uppy, onUploadStart, onUploadComplete, placeId]
  );

  // Handle file input change
  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        try {
          const resizedBlob = await resizeImage(file);
          console.log("Resized blob:", resizedBlob);
          uppy.addFile({
            name: file.name,
            type: file.type,
            data: resizedBlob,
            meta: { placeId },
          });
        } catch (err) {
          console.error(err);
          toast.error(`Failed to add file: ${file.name}`);
        }
      }
    }
  };

  const selectedFiles = uppy.getFiles();

  return (
    <div>
      <label className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition-colors duration-300">
        <span>Select Images</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
      </label>
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file) => (
              <div key={file.id} className="relative">
                <img
                  src={URL.createObjectURL(file.data as File)}
                  alt={file.name}
                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <StatusBar
        uppy={uppy}
        hideAfterFinish={false}
        showProgressDetails={true}
        hideUploadButton={true}
        hideRetryButton={false}
        hidePauseResumeButton={false}
        hideCancelButton={false}
      />
    </div>
  );
};

// Export the startUpload function separately
export const useImageUpload = (uppy: Uppy<ExtendedMetadata>) => {
  return {
    startUpload: async (reviewId: string) => {
      if (!uppy) return;

      uppy.getFiles().forEach((file) => {
        const classification = file.meta.classification;
        uppy.setFileMeta(file.id, {
          label: classification,
          placeId: file.meta.placeId,
          reviewId,
        });
      });

      return uppy.upload();
    },
    getSelectedFiles: () => uppy.getFiles(),
  };
};
