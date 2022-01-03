import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { graphcms } from "~/data/graphql.server";
import { Content } from "~/types/content";
import { Artwork } from "~/types/artworks";
import ArtworkDetailItem from "~/components/ArtworkDetailItem";
import getTitle from "~/utils/getTitle";
import ContentPage from "~/components/ContentPage";

interface LoaderData {
  content: Content;
  artwork: Artwork;
}

const query = gql`
  query GetArtwork($slug: String!) {
    content(where: { slug: $slug }) {
      id
      slug
      title
      content
    }
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
  const { content, artwork } = await graphcms.request(query, { slug: params.slug });
  if (!content && !artwork) {
    throw new Response("Not Found", { status: 404 });
  }
  return { content, artwork };
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: getTitle(data.content?.title || data.artwork?.title) };
};

export default function CatchAll() {
  const data = useLoaderData<LoaderData>();
  if (data.content) {
    return <ContentPage content={data.content} />
  } else if (data.artwork) {
    return <ArtworkDetailItem artwork={data.artwork} />
  } else {
    return null;
  }
}
