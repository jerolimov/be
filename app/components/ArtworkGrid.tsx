import { Link } from "remix";
import { MailIcon, PhoneIcon } from '@heroicons/react/solid'
import { Artwork } from "~/types/artworks";

export default function ArtworkListItem({ artworks }: { artworks: Artwork[] }) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.filter((artwork) => artwork.images?.length > 0).map((artwork) => (
        <li key={artwork.id} className="relative">
          <Link to={`/${artwork.slug}`}>
            <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
              <img src={artwork.images[0].url} alt="" className="object-cover pointer-events-none group-hover:opacity-75" />
              <button type="button" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View details for {artwork.title}</span>
              </button>
            </div>
            <h1 className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{artwork.title}</h1>
            <p className="block text-sm font-medium text-gray-500 pointer-events-none">{artwork.title}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
