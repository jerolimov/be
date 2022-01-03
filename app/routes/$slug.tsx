import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { graphcms } from "~/data/graphql.server";
import { Artwork } from "~/types/artworks";
import ArtworkDetailItem from "~/components/ArtworkDetailItem";
import getTitle from "~/utils/getTitle";

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

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: getTitle(data.artwork.title) };
};

export default function CatchAll() {
  const data = useLoaderData<LoaderData>();
  return (
    <ArtworkDetailItem artwork={data.artwork} />
  )
}
