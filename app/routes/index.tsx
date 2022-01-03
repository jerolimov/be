import { LoaderFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { Artwork } from "~/types/artworks";
import { graphcms } from "~/data/graphql.server";
import ArtworkListItem from "~/components/ArtworkListItem";

interface LoaderData {
  artworks: Artwork[];
}

const query = gql`
  {
    artworks {
      id
      slug
      title
      content
      images {
        id
        url
      }
    }
  }
`;

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const { artworks } = await graphcms.request(query);
  return { artworks };
}

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      {data.artworks.map(artwork => (
        <ArtworkListItem key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
