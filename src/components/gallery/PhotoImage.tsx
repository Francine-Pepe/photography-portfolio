import Image from "next/image";
import type { Photo } from "@/types";

type PhotoImageProps = {
  photo: Photo;
  priority?: boolean;
  sizes?: string;
};

const DEFAULT_SIZES = "(max-width: 600px) 90vw, 45vw";

export default function PhotoImage({
  photo,
  priority = false,
  sizes = DEFAULT_SIZES,
}: PhotoImageProps) {
  return (
    <Image
      src={photo.image}
      alt={photo.name}
      fill
      sizes={sizes}
      priority={priority}
    />
  );
}
