import type { UploadFile } from "@/types";

import { ADMIN_LABELS } from "@/data/admin/labels";

type Props = {
  files: UploadFile[];
};

export default function PhotoUploadList({ files }: Props) {
  if (!files.length) return null;

  return (
    <div className="photo-uploader__files">
      <h3>{ADMIN_LABELS.uploads.results}</h3>

      {files.map((file) => (
        <div key={file.id} className="photo-uploader__file">
          <span>{file.name}</span>

          <span
            className={`photo-uploader__status photo-uploader__status--${file.status}`}
          >
            {file.status === "uploading"
              ? ADMIN_LABELS.uploads.uploading
              : file.status === "success"
                ? ADMIN_LABELS.uploads.uploaded
                : file.message || ADMIN_LABELS.uploads.failed}
          </span>
        </div>
      ))}
    </div>
  );
}
