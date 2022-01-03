import { LoaderFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { marked } from "marked";
import { Artwork } from "~/types/artworks";
import { graphcms } from "~/data/graphql.server";
import ArtworkListItem from "~/components/ArtworkListItem";

interface QueryData {
  artworks: Artwork[];
}

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
        url(
          transformation: {
            image: {
              resize: {
                height: 200,
                width: 200,
              }
            }
            validateOptions: true
          }
        )
      }
    }
  }
`;

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const { artworks } = await graphcms.request<QueryData>(query);
  artworks.forEach((artwork) => {
    artwork.content = marked(artwork.content);
  })
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
