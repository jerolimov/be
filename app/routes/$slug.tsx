import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { marked } from "marked";
import { graphcms } from "~/data/graphql.server";
import { Content } from "~/types/content";
import { Artwork } from "~/types/artworks";
import ArtworkDetailItem from "~/components/ArtworkDetailItem";
import getTitle from "~/utils/getTitle";
import ContentPage from "~/components/ContentPage";

type QueryData = {
  content?: Content;
  artwork?: Artwork;
};

type LoaderData = {
  type: 'content',
  content: Content;
} | {
  type: 'artwork',
  artwork: Artwork;
};

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
  const { content, artwork } = await graphcms.request<QueryData>(query, { slug: params.slug });
  if (content) {
    content.content = marked(content.content || '');
    return { type: 'content', content };
  } else if (artwork) {
    artwork.content = marked(artwork.content);
    return { type: 'artwork', artwork };
  } else {
    throw new Response("Not Found", { status: 404 });
  }
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  if (data.type === 'content') {
    return { title: getTitle(data.content.title) };
  } else if (data.type === 'artwork') {
    return { title: getTitle(data.artwork.title) };
  } else {
    return { title: getTitle() };
  }
};

export default function CatchAll() {
  const data = useLoaderData<LoaderData>();
  if (data.type === 'content') {
    return <ContentPage content={data.content} />
  } else if (data.type === 'artwork') {
    return <ArtworkDetailItem artwork={data.artwork} />
  } else {
    return null;
  }
}
