"use client";

import { useActionState } from "react";
import {
  createGallery,
  type GalleryState,
} from "@/app/admin/galleries/actions";
import { ADMIN_LABELS } from "@/data/admin/labels";

const initialState: GalleryState = {};

export default function CreateGalleryForm() {
  const [state, formAction, pending] = useActionState(
    createGallery,
    initialState,
  );

  return (
    <form action={formAction} className="gallery-form">
      <div className="gallery-form__field">
        <label htmlFor="clientName">
          {ADMIN_LABELS.galleryForm.clientName}
        </label>

        <input
          id="clientName"
          name="clientName"
          type="text"
          placeholder={ADMIN_LABELS.galleryForm.clientPlaceholder}
          required
        />
      </div>

      <div className="gallery-form__field">
        <label htmlFor="expirationDate">
          {ADMIN_LABELS.galleryForm.expirationDate}
        </label>

        <input id="expirationDate" name="expirationDate" type="date" />
      </div>

      {state.error && (
        <p role="alert" className="gallery-form__error">
          {state.error}
        </p>
      )}

      {state.link && (
        <div className="gallery-form__success">
          <p>{ADMIN_LABELS.galleryForm.success}</p>

          <label htmlFor="galleryLink">Private gallery link</label>

          <input id="galleryLink" type="text" value={state.link} readOnly />

          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(state.link!)}
          >
            Copy link
          </button>
        </div>
      )}

      <button type="submit" disabled={pending}>
        {pending
          ? ADMIN_LABELS.galleryForm.submitting
          : ADMIN_LABELS.galleryForm.submit}
      </button>
    </form>
  );
}
