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
      {artwork.technique ? <div>{artwork.technique}</div> : null}
      {artwork.material ? <div>{artwork.material}</div> : null}
      {artwork.size ? <div>{artwork.size}</div> : null}
    </div>
  );
}