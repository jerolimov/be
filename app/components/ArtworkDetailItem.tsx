import { Artwork } from "~/types/artworks";

export default function ArtworkDetailItem({ artwork }: { artwork: Artwork }) {
  return (
    <div>
      <h1>{artwork.title}</h1>
      {artwork.images?.map((image) => (
        <div key={image.id}>
        <img src={image.url} />
        </div>
      ))}
      <div dangerouslySetInnerHTML={{ __html: artwork.content }} />
    </div>
  );
}