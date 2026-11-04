"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toggleGalleryStatus } from "@/app/admin/galleries/[id]/actions";

type Props = {
  galleryId: string;
  isActive: boolean;
};

export default function GalleryStatusButton({ galleryId, isActive }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const action = isActive ? "deactivate" : "reactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this gallery?`,
    );

    if (!confirmed) return;

    setMessage("");

    startTransition(async () => {
      const result = await toggleGalleryStatus(galleryId);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="gallery-status-action">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={isActive ? "is-active" : "is-inactive"}
      >
        {isPending
          ? "Updating..."
          : isActive
            ? "Deactivate gallery"
            : "Reactivate gallery"}
      </button>

      {message && <p role="alert">{message}</p>}
    </div>
  );
}
