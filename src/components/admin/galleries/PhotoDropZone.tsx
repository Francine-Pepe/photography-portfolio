"use client";

import { useRef } from "react";

import { PHOTO_UPLOAD_CONFIG } from "@/data/admin/photo-upload";
import { ADMIN_LABELS } from "@/data/admin/labels";

type Props = {
  onFilesSelected: (files: FileList | File[]) => void;
  disabled?: boolean;
};

export default function PhotoDropzone({
  onFilesSelected,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="photo-uploader__dropzone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();

        if (!disabled) {
          onFilesSelected(event.dataTransfer.files);
        }
      }}
    >
      <div>
        <h3>{ADMIN_LABELS.uploads.title}</h3>

        <p>{ADMIN_LABELS.uploads.dropzone}</p>

        <span>
          {ADMIN_LABELS.uploads.formats} · {ADMIN_LABELS.uploads.maxSize}
        </span>

        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {ADMIN_LABELS.uploads.select}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={PHOTO_UPLOAD_CONFIG.accept}
          multiple
          hidden
          disabled={disabled}
          onChange={(event) => {
            if (event.target.files) {
              onFilesSelected(event.target.files);
              event.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
