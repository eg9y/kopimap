import { useState, useImperativeHandle, forwardRef } from 'react';
import Uppy from '@uppy/core';
import { Dashboard, useUppyEvent } from '@uppy/react';
import Compressor from '@uppy/compressor';
import Tus from '@uppy/tus';
import { Session } from '@supabase/supabase-js';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

interface ImageUploadProps {
  onFilesSelected: (files: any[]) => void;
  onUploadComplete: (urls: string[]) => void;
  sessionInfo: Session;
}

export interface ImageUploadRef {
  triggerUpload: () => Promise<string[]>;
}

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(({ onFilesSelected, onUploadComplete, sessionInfo }, ref) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

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

  useUppyEvent(uppy, 'file-added', (file) => {
    uppy?.setFileMeta(file.id, {
      ...file.meta,
      bucketName: 'review-images',
      objectName: `${Date.now()}-${file.name}`,
      cacheControl: 'max-age=31536000',
      contentType: file.type,
    })
    console.log('file meta', {
      ...file.meta,
      bucketName: 'review-images',
      objectName: `${Date.now()}-${file.name}`,
      cacheControl: 'max-age=31536000',
      contentType: file.type,
    });
    onFilesSelected([file]);
  })

  useUppyEvent(uppy, 'upload-success', (file) => {
    const uploadUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/review-images/${file?.meta.objectName}`;
    setUploadedUrls(prevUrls => [...prevUrls, uploadUrl]);
  })

  uppy.on('complete', () => {
    onUploadComplete(uploadedUrls);
  });
  uppy.on('error', (error) => {
    console.error('Upload error:', error);
  });

  useImperativeHandle(ref, () => ({
    triggerUpload: async () => {
      const result = await uppy.upload();
      if (!result?.successful) {
        return [];
      }
      return result.successful.map(file => 
        `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/review-images/${file.meta.objectName}`
      );
    }
  }));

  if (!uppy) {
    return <div>Loading...</div>;
  }

  return (
    <Dashboard
      uppy={uppy}
      plugins={['Compressor']}
      hideUploadButton={true}
      height={200}
      metaFields={[
        { id: 'name', name: 'Name', placeholder: 'File name' }
      ]}
    />
  );
});