import { Session } from "@supabase/supabase-js";
import Compressor from "@uppy/compressor";
import Uppy, { UppyFile } from "@uppy/core";
import { Dashboard, useUppyEvent } from "@uppy/react";
import Tus from "@uppy/tus";
import Pica from "pica";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { toast } from "sonner";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

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
					maxNumberOfFiles: 10,
					allowedFileTypes: ["image/*"],
				},
			})
				.use(Compressor, {
					id: "compressor",
					quality: 0.85,
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
				}),
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
			isOriginal: boolean = false,
		): Promise<CompressedImage> => {
			const pica = new Pica();
			const img = await createImageBitmap(file);

			let targetWidth: number;
			let targetHeight: number;

			if (isOriginal) {
				// Reduce dimensions by 50%, maintaining aspect ratio
				const scaleFactor = 0.5;
				targetWidth = Math.round(img.width * scaleFactor);
				targetHeight = Math.round(img.height * scaleFactor);

				// Ensure minimum dimensions
				const minDimension = 800;
				if (targetWidth < minDimension || targetHeight < minDimension) {
					const minScaleFactor = Math.min(
						1,
						minDimension / Math.min(img.width, img.height),
					);
					targetWidth = Math.round(img.width * minScaleFactor);
					targetHeight = Math.round(img.height * minScaleFactor);
				}
			} else {
				// Fit within max dimensions, maintaining aspect ratio
				const aspectRatio = img.width / img.height;
				if (aspectRatio > maxWidth / maxHeight) {
					targetWidth = maxWidth;
					targetHeight = Math.round(maxWidth / aspectRatio);
				} else {
					targetWidth = Math.round(maxHeight * aspectRatio);
					targetHeight = maxHeight;
				}
			}

			const canvas = document.createElement("canvas");
			canvas.width = targetWidth;
			canvas.height = targetHeight;

			await pica.resize(img, canvas);

			// Set quality parameter to reduce file size
			const qualityFactor = 0.7;
			const resizedBlob = await pica.toBlob(
				canvas,
				"image/webp",
				qualityFactor,
			);

			// Generate new file name
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

				// Compress and resize original image
				const originalWebp = await compressAndResizeImage(
					file.data as File,
					2048, // Max width (unused for original)
					2048, // Max height (unused for original)
					true,
				);

				// Update original file's data with resized blob
				uppy.setFileState(file.id, {
					...file,
					data: originalWebp.blob,
					name: originalWebp.name,
					size: originalWebp.blob.size,
					type: "image/webp",
					extension: "webp",
				});

				// Set metadata for original WebP file
				uppy.setFileMeta(file.id, {
					timestamp,
					bucketName: "review-images",
					objectName: `${placeId}/${timestamp}-${originalWebp.name}`,
					cacheControl: "max-age=31536000",
					contentType: "image/webp",
				});

				// Generate resized images
				const resized120x120 = await compressAndResizeImage(
					file.data as File,
					120,
					120,
				);
				const resized346x461 = await compressAndResizeImage(
					file.data as File,
					346,
					461,
				);

				// Add resized images to Uppy
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
			[placeId, uppy],
		);

		// Attach the handleFileAdded event listener
		useUppyEvent(uppy, "file-added", handleFileAdded);

		useUppyEvent(uppy, "file-added", async (file) => {
			if (file.meta.checkedNSFW) {
				// Avoid re-checking if already checked
				return;
			}

			// Placeholder for NSFW check
			// const isSafeImage = await isSafe(file.data as File);
			// if (!isSafeImage) {
			//   uppy.removeFile(file.id);
			//   return;
			// }

			uppy.setFileMeta(file.id, {
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
				const newUrls = result.successful
					.filter((file) => !file.meta.isResizedVersion)
					.map(
						(file) =>
							`${
								import.meta.env.VITE_SUPABASE_URL
							}/storage/v1/object/public/review-images/${file.meta.objectName}`,
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
	},
);
