"use client";

import { useState } from "react";

import PhotoDropZone from "./PhotoDropZone";
import PhotoUploadList from "./PhotoUploadList";

import { uploadPhoto } from "@/lib/admin/upload-photo";

import type { UploadFile } from "@/types";

import "@/styles/admin/photo-uploader.scss";

type Props = {
  galleryId: string;
};

export default function PhotoUploader({ galleryId }: Props) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleFilesSelected(selectedFiles: FileList | File[]) {
    const fileArray = Array.from(selectedFiles);

    if (!fileArray.length || uploading) return;

    setUploading(true);

    for (const file of fileArray) {
      const id = crypto.randomUUID();

      setFiles((previous) => [
        ...previous,
        {
          id,
          name: file.name,
          status: "uploading",
        },
      ]);

      try {
        await uploadPhoto(galleryId, file);

        setFiles((previous) =>
          previous.map((item) =>
            item.id === id ? { ...item, status: "success" } : item,
          ),
        );
      } catch (error) {
        setFiles((previous) =>
          previous.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "error",
                  message:
                    error instanceof Error ? error.message : "Upload failed.",
                }
              : item,
          ),
        );
      }
    }

    setUploading(false);
  }

  return (
    <section className="photo-uploader">
      <PhotoDropZone
        onFilesSelected={handleFilesSelected}
        disabled={uploading}
      />

      <PhotoUploadList files={files} />

      {uploading && <p>Uploading photos...</p>}
    </section>
  );
}
