"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteGallery } from "@/app/admin/galleries/[id]/actions";

type Props = {
  galleryId: string;
};

export default function DeleteGalleryButton({ galleryId }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery? All uploaded photos will also be permanently deleted.",
    );

    if (!confirmed) return;

    setMessage("");

    startTransition(async () => {
      const result = await deleteGallery(galleryId);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      router.replace("/admin/galleries");
      router.refresh();
    });
  }

  return (
    <div className="delete-gallery">
      <button type="button" onClick={handleDelete} disabled={isPending}>
        {isPending ? "Deleting..." : "Delete gallery"}
      </button>

      {message && <p role="alert">{message}</p>}
    </div>
  );
}
