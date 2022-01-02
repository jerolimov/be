import { Link, LoaderFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { Artwork } from "~/types/artworks";
import { graphcms } from "~/data/graphql.server";

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
      ))}
    </div>
  );
}
