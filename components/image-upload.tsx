import { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import Uppy, { UppyFile } from '@uppy/core';
import { useUppyEvent, Dashboard } from '@uppy/react';
import Compressor from '@uppy/compressor';
import Tus from '@uppy/tus';
import { Session } from '@supabase/supabase-js';
import NSFWFilter from 'nsfw-filter';
import { toast } from 'sonner';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';


interface ImageUploadProps {
  onFilesSelected: (files: any[]) => void;
  onUploadComplete: (urls: string[]) => void;
  sessionInfo: Session;
  existingUrls?: string[];
}

export interface ImageUploadRef {
  triggerUpload: () => Promise<string[]>;
}

async function isSafe(file: File) {
  try {
    const predictions = await NSFWFilter.predictImg(file, 3);
    const pornPrediction = predictions.find(
      ({ className }) => className === 'Porn'
    );
    const hentaiPrediction = predictions.find(
      ({ className }) => className === 'Hentai'
    );

    // Check if either Porn or Hentai probability exceeds the threshold
    return !(
      (pornPrediction && pornPrediction.probability > 0.25) ||
      (hentaiPrediction && hentaiPrediction.probability > 0.25)
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(({ onFilesSelected, onUploadComplete, sessionInfo, existingUrls = [] }, ref) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls);


  const checkNSFW = useCallback(async (file: UppyFile<{},{}>) => {
    try {
      const isImgSafe = await isSafe(file.data as File);
      if (!isImgSafe) {
        toast.error('Inappropriate content detected. Please upload a different image.');
        return false;
      }
      console.log('its safe!');
      return true;
    } catch (error) {
      console.error('Error checking NSFW:', error);
      toast.error('Error checking image content. Please try again.');
      return false;
    }
  }, []);

  const [uppy] = useState(() => new Uppy({
    id: 'imageUploader',
    autoProceed: false,
    restrictions: {
      maxNumberOfFiles: 5,
      allowedFileTypes: ['image/*'],
    },
  }).use(Compressor, {
    id: 'compressor',
    quality: 0.6,
    limit: 10,
  }).use(Tus, {
    id: 'tus',
    endpoint: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/upload/resumable`,
    headers: {
      authorization: `Bearer ${sessionInfo.access_token}`,
      apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    chunkSize: 6 * 1024 * 1024,
    allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl'],
  }));

  useUppyEvent(uppy, 'file-added', async (file) => {
    const isSafe = await checkNSFW(file);
    if (!isSafe) {
      uppy.removeFile(file.id);
      return;
    }

    uppy?.setFileMeta(file.id, {
      ...file.meta,
      bucketName: 'review-images',
      objectName: `${Date.now()}-${file.name}`,
      cacheControl: 'max-age=31536000',
      contentType: file.type,
    });
    console.log('file meta', {
      ...file.meta,
      bucketName: 'review-images',
      objectName: `${Date.now()}-${file.name}`,
      cacheControl: 'max-age=31536000',
      contentType: file.type,
    });
    onFilesSelected([file]);
  });

  useUppyEvent(uppy, 'upload-success', (file) => {
    const uploadUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/review-images/${file?.meta.objectName}`;
    setUploadedUrls(prevUrls => [...prevUrls, uploadUrl]);
  });

  uppy.on('complete', () => {
    onUploadComplete(uploadedUrls);
  });
  uppy.on('error', (error) => {
    console.error('Upload error:', error);
    toast.error('An error occurred during upload. Please try again.');
  });

  useImperativeHandle(ref, () => ({
  triggerUpload: async () => {
    if (!uppy) return [];
    const result = await uppy.upload();
    if (!result?.successful) {
      return uploadedUrls;
    }
    const newUrls = result.successful.map(file => 
      `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/review-images/${file.meta.objectName}`
    );
    return [...uploadedUrls, ...newUrls];
  }
}));

  if (!uppy) {
    return <div>Loading...</div>;
  }

  return (
    <Dashboard
      uppy={uppy as any}
      plugins={['Compressor']}
      hideUploadButton={true}
      height={200}
      metaFields={[
        { id: 'name', name: 'Name', placeholder: 'File name' }
      ]}
    />
  );
});