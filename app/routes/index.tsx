import { LoaderFunction, useLoaderData } from "remix";
import { artworks } from "~/data/artworks.server";
import { Artwork } from "~/types/artworks";

interface LoaderData {
  artworks: Artwork[];
}

export const loader: LoaderFunction = ({ params }): LoaderData => {
  return { artworks };
}

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      {data.artworks.map(artwork => (
        <div>
          <img src={artwork.image.url} />
          <h2>{artwork.title}</h2>
          <div>{artwork.content}</div>
        </div>
      ))}
    </div>
  );
}
