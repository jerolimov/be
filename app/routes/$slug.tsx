import { LoaderFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { graphcms } from "~/data/graphql.server";
import { Artwork } from "~/types/artworks";

interface LoaderData {
  artwork: Artwork;
}

const query = gql`
  query GetArtwork($slug: String!) {
    artwork(where: { slug: $slug }) {
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

export const loader: LoaderFunction = async ({ params }): Promise<LoaderData> => {
  const { artwork } = await graphcms.request(query, { slug: params.slug });
  if (!artwork) {
    throw new Response("Not Found", { status: 404 });
  }
  return { artwork };
}

export default function CatchAll() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>{data.artwork.title}</h1>
      {data.artwork.images?.map((image) => (
        <div key={image.id}>
        <img src={image.url} />
        </div>
      ))}
      <div dangerouslySetInnerHTML={{ __html: data.artwork.content }} />
    </div>
  )
}
