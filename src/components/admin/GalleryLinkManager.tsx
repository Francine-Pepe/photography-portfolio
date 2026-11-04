"use client";

import { useState, useTransition } from "react";
import { generateGalleryLink } from "@/app/admin/galleries/[id]/link-actions";

type Props = {
  galleryId: string;
};

export default function GalleryLinkManager({ galleryId }: Props) {
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setMessage("");
    setLink("");

    startTransition(async () => {
      const result = await generateGalleryLink(galleryId);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setLink(result.link ?? "");
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setMessage("Link copied!");
    } catch {
      setMessage("Unable to copy the link. Please copy it manually.");
    }
  }

  return (
    <div className="gallery-link">
      <div className="gallery-link__header">
        <h3>Private gallery link</h3>
        <button type="button" onClick={handleGenerate} disabled={isPending}>
          {isPending ? "Generating..." : "Generate new link"}
        </button>
      </div>

      {link && (
        <div className="gallery-link__result">
          <input type="text" value={link} readOnly />
          <button type="button" onClick={handleCopy}>
            Copy link
          </button>
        </div>
      )}

      {message && <p className="gallery-link__message">{message}</p>}

      <p className="gallery-link__notice">
        Generating a new link invalidates the previously generated link.
      </p>
    </div>
  );
}
