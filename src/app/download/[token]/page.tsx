import { notFound } from "next/navigation";
import Image from "next/image";

import { getClientGallery } from "@/lib/client-gallery/get-client-gallery";

import "@/styles/client-gallery.scss";

type Props = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export default async function ClientGalleryPage({ params }: Props) {
  const { token } = await params;

  const gallery = await getClientGallery(token);

  if (!gallery) {
    notFound();
  }

  return (
    <main className="client-gallery">
      <header className="client-gallery__header">
        <span>Da Silva Photography</span>
        <h1>{gallery.clientName}</h1>
        <p>Your private photo gallery</p>
      </header>

      <section className="client-gallery__download-all">
        <a href={`/download/${token}/zip`}>Download all photos</a>
      </section>

      <section className="client-gallery__photos">
        {gallery.photos.length === 0 ? (
          <p>No photos available yet.</p>
        ) : (
          <div className="client-gallery__grid">
            {gallery.photos.map((photo) => (
              <article className="client-gallery__item" key={photo.id}>
                {photo.signedUrl ? (
                  <>
                    <a href={photo.signedUrl} target="_blank" rel="noreferrer">
                      <Image
                        src={photo.signedUrl}
                        alt={photo.fileName}
                        width={900}
                        height={700}
                        unoptimized
                      />
                    </a>

                    <div className="client-gallery__photo-info">
                      <span>{photo.fileName}</span>
                    </div>
                  </>
                ) : (
                  <p>Photo temporarily unavailable.</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="client-gallery__footer">
        <p>© Da Silva Fotografie</p>
      </footer>
    </main>
  );
}
