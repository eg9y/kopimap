import { Session } from "@supabase/supabase-js";
import Uppy, { UppyFile } from "@uppy/core";
import { Dashboard, useUppyEvent } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import { forwardRef, useImperativeHandle, useState } from "react";
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
					maxNumberOfFiles: 4,
					allowedFileTypes: ["image/*"],
				},
				meta: {
					placeId, // Pass placeId to the server
				},
			}).use(XHRUpload, {
				endpoint: `${import.meta.env.VITE_MEILISEARCH_URL}/api/upload-image`, // Nitro server API endpoint
				headers: {
					authorization: `Bearer ${sessionInfo.access_token}`,
				},
				fieldName: "file",
				formData: true,
				allowedMetaFields: ["placeId"], // Corrected from metaFields
				limit: 1, // Upload files one by one
			}),
		);

		useUppyEvent(uppy, "file-added", async (file) => {
			// Placeholder for NSFW check
			// const isSafeImage = await isSafe(file.data as File);
			// if (!isSafeImage) {
			//   uppy.removeFile(file.id);
			//   return;
			// }

			uppy.setFileMeta(file.id, {
				...file.meta,
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
					.filter((file) => !!file.response?.body?.url)
					.map((file) => file.response!.body!.url);
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
