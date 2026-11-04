"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  createPhotoUploadUrl,
  savePhotoRecord,
} from "@/app/admin/galleries/[id]/actions";

import "@/styles/admin/photo-uploader.scss";

type Props = {
  galleryId: string;
};

type UploadStatus = {
  name: string;
  status: "uploading" | "success" | "error";
  message?: string;
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/tiff"];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function PhotoUploader({ galleryId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<UploadStatus[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFiles(selectedFiles: FileList | File[]) {
    const fileArray = Array.from(selectedFiles);

    if (!fileArray.length || uploading) return;

    setUploading(true);

    const supabase = createClient();

    for (const file of fileArray) {
      const entry: UploadStatus = {
        name: file.name,
        status: "uploading",
      };

      setFiles((previous) => [...previous, entry]);

      const updateStatus = (status: UploadStatus) => {
        setFiles((previous) =>
          previous.map((item, index) =>
            index === previous.length - 1 &&
            item.name === file.name &&
            item.status === "uploading"
              ? status
              : item,
          ),
        );
      };

      if (!ALLOWED_TYPES.includes(file.type)) {
        updateStatus({
          ...entry,
          status: "error",
          message: "Unsupported image format.",
        });
        continue;
      }

      if (file.size > MAX_FILE_SIZE || file.size <= 0) {
        updateStatus({
          ...entry,
          status: "error",
          message: "File must be smaller than 50 MB.",
        });
        continue;
      }

      try {
        const upload = await createPhotoUploadUrl(
          galleryId,
          file.name,
          file.type,
          file.size,
        );

        if ("error" in upload) {
          throw new Error(upload.error);
        }

        const { error: uploadError } = await supabase.storage
          .from("client-galleries")
          .uploadToSignedUrl(upload.path, upload.token, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const result = await savePhotoRecord(
          galleryId,
          file.name,
          upload.path,
          file.type,
          file.size,
        );

        if ("error" in result) {
          throw new Error(result.error);
        }

        updateStatus({
          ...entry,
          status: "success",
        });
      } catch (error) {
        updateStatus({
          ...entry,
          status: "error",
          message: error instanceof Error ? error.message : "Upload failed.",
        });
      }
    }

    setUploading(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    uploadFiles(event.dataTransfer.files);
  }

  return (
    <section className="photo-uploader">
      <div
        className={`photo-uploader__dropzone ${dragging ? "is-dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div>
          <h3>Upload photos</h3>
          <p>Drag and drop your photos here</p>
          <span>JPEG, PNG, WebP or TIFF · Maximum 50 MB per photo</span>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            Select photos
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/tiff"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files) {
                uploadFiles(event.target.files);
                event.target.value = "";
              }
            }}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="photo-uploader__files">
          <h3>Upload results</h3>

          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="photo-uploader__file">
              <span>{file.name}</span>

              <span
                className={`photo-uploader__status photo-uploader__status--${file.status}`}
              >
                {file.status === "uploading"
                  ? "Uploading..."
                  : file.status === "success"
                    ? "Uploaded"
                    : file.message || "Failed"}
              </span>
            </div>
          ))}
        </div>
      )}

      {uploading && <p>Uploading photos...</p>}
    </section>
  );
}
