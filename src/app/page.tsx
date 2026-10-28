import { getPhotos } from "@/lib/photos";
import Introduction from "@/components/home/Introduction";
import CategoryGrid from "@/components/home/CategoryGrid";

async function HomePage() {
  const photos = await getPhotos();
  const firstPhoto = photos[0];

  if (!firstPhoto) {
    return <main>No photos found.</main>;
  }

  return (
    <main>
      <Introduction />
      <CategoryGrid photos={photos} />
    </main>
  );
}

export default HomePage;
