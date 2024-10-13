import { Session } from "@supabase/supabase-js";
import Uppy, { UppyFile } from "@uppy/core";
import { Dashboard, useUppyEvent } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-wasm";
import {
  setWasmPaths,
  getThreadsCount,
  setThreadsCount,
} from "@tensorflow/tfjs-backend-wasm";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

const CLASS_NAMES = ["Food & Drinks", "Menu", "Vibes"];

interface ImageUploadProps {
  onFilesSelected: (files: any[]) => void;
  sessionInfo: Session;
  existingUrls?: string[];
  placeId: string;
}

export interface ImageUploadRef {
  triggerUpload: () => Promise<string[]>;
}

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ onFilesSelected, sessionInfo, existingUrls = [], placeId }, ref) => {
    const [uppy] = useState(() =>
      new Uppy({
        id: "imageUploader",
        autoProceed: false,
        restrictions: {
          maxNumberOfFiles: 4,
          allowedFileTypes: ["image/*"],
        },
        meta: {
          placeId,
        },
      }).use(XHRUpload, {
        endpoint: `${import.meta.env.VITE_MEILISEARCH_URL}/api/upload-image`,
        headers: {
          authorization: `Bearer ${sessionInfo.access_token}`,
        },
        fieldName: "file",
        formData: true,
        allowedMetaFields: ["placeId"],
        limit: 1,
      })
    );

    const [modelLoading, setModelLoading] = useState(true);
    const workerRef = useRef<Worker | null>(null);
    const classificationQueue = useRef<
      Array<{ file: UppyFile<any, any>; resolve: (value: any) => void }>
    >([]);

    useEffect(() => {
      async function setupWasm() {
        try {
          setWasmPaths(
            "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.21.0/dist/"
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
        workerRef.current = new Worker(
          new URL("./lib/model-worker.ts", import.meta.url),
          { type: "module" }
        );

        workerRef.current.onmessage = (event) => {
          if (event.data.type === "modelLoaded") {
            setModelLoading(false);
            processQueue();
          } else if (event.data.type === "modelLoadError") {
            toast.error("Failed to load the image classification model.");
            setModelLoading(false);
          } else if (event.data.type === "predictionResult") {
            const { prediction } = event.data;
            console.log("Image classification results:", prediction);
          } else if (event.data.type === "predictionError") {
            toast.error("An error occurred during image classification.");
          }
        };

        workerRef.current.postMessage({ type: "loadModel" });
      });

      return () => {
        workerRef.current?.terminate();
      };
    }, []);

    const processQueue = () => {
      while (classificationQueue.current.length > 0) {
        const { file, resolve } = classificationQueue.current.shift()!;
        runPrediction(file.data as File).then(resolve);
      }
    };

    const runPrediction = async (file: File) => {
      if (!workerRef.current) {
        console.warn("Worker not initialized");
        return null;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const imageData = ctx?.getImageData(0, 0, img.width, img.height);

      return new Promise((resolve) => {
        if (workerRef.current) {
          workerRef.current.onmessage = (event) => {
            if (event.data.type === "predictionResult") {
              console.log("Prediction result:", event.data.prediction);
              resolve(event.data.prediction);
            } else if (event.data.type === "predictionError") {
              console.error("Prediction error:", event.data.error);
              resolve(null);
            }
          };
          console.log("Sending message to worker", imageData);
          workerRef.current.postMessage({ type: "runPrediction", imageData });
        } else {
          resolve(null);
        }
      });
    };

    useUppyEvent(uppy, "file-added", async (file) => {
      let prediction;
      if (!modelLoading) {
        prediction = await runPrediction(file.data as File);
      } else {
        prediction = await new Promise((resolve) => {
          classificationQueue.current.push({ file, resolve });
        });
      }

      if (prediction) {
        uppy.setFileMeta(file.id, {
          ...file.meta,
          classification: prediction,
        });
      }

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
        const newUrls = result.successful
          .filter((file) => !!file.response?.body?.url)
          .map((file) => file.response!.body!.url);
        return newUrls;
      },
    }));

    return (
      <>
        {modelLoading && (
          <div className="text-sm text-gray-500 mb-2">
            Loading image classification model...
          </div>
        )}
        <Dashboard
          uppy={uppy as any}
          hideUploadButton={true}
          height={200}
          metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
          showProgressDetails={true}
          proudlyDisplayPoweredByUppy={false}
          showSelectedFiles={false}
        />
      </>
    );
  }
);
