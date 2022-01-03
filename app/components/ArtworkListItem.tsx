import { Link } from "remix";
import { Artwork } from "~/types/artworks";

export default function ArtworkListItem({ artwork }: { artwork: Artwork }) {
  return (
    <div key={artwork.id}>
      <Link to={`/${artwork.slug}`}>
        {artwork.images?.map((image) => (
          <div key={image.id}>
            <img src={image.url} />
          </div>
        ))}
        <h2>{artwork.title}</h2>
      </Link>
      <div dangerouslySetInnerHTML={{ __html: artwork.content }} />
    </div>
  );
}
