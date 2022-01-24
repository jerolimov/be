import { Link } from "remix";
import { Artwork } from "~/types/artworks";

export default function ArtworkGrid({ artworks }: { artworks: Artwork[] }) {
  return (
    <>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.filter((artwork) => artwork.images?.length > 0).map((artwork, index) => (
          <li key={artwork.id}>
            <Link to={`/${artwork.slug}`} className="hover:opacity-75">
              <img
                width="300"
                height="300"
                src={artwork.images[0].url}
                alt=""
                loading={index >= 10 ? 'lazy' : undefined}
                className="rounded-lg"
                style={{ aspectRatio: '1' }}
              />
              <h1 className="text-sm font-medium text-gray-900 truncate">{artwork.title}</h1>
            </Link>
          </li>
        ))}
      </ul>
      <ul role="list" className="">
        {artworks.filter((artwork) => !artwork.images?.length).map((artwork) => (
          <li key={artwork.id}>
            <Link to={`/${artwork.slug}`} className="hover:opacity-75">
              <h2 className="text-sm font-medium text-gray-900 truncate">{artwork.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
