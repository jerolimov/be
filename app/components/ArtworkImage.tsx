import { Artwork } from "~/types/artworks";

export type ArtworkImageProps = { artwork: Artwork } & React.ImgHTMLAttributes<HTMLImageElement>;

export default function ArtworkImage({ artwork }: ArtworkImageProps) {
  return (
    <div>
      <img
        width="300"
        height="300"
        src={artwork.images[0].url}
        alt=""
        loading="lazy"
        className="rounded-lg"
        style={{ aspectRatio: '1' }}
      />
      {artwork.images.length > 1 ? <CollectionIcon /> : null}
    </div>
  );
}

const CollectionIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )
}