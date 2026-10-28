import Image from "next/image";
import type { Photo } from "@/types";

type PhotoImageProps = {
  photo: Photo;
  priority?: boolean;
};

function PhotoImage({ photo, priority = false }: PhotoImageProps) {
  return (
    <Image
      src={photo.image}
      alt={photo.name}
      width={1200}
      height={900}
      priority={priority}
      sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
}

export default PhotoImage;
