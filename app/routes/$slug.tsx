import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { marked } from "marked";
import { graphcms } from "~/data/graphql.server";
import { Page } from "~/types/pages";
import { Artwork } from "~/types/artworks";
import ArtworkDetailItem from "~/components/ArtworkDetailItem";
import getTitle from "~/utils/getTitle";
import ContentPage from "~/components/ContentPage";

type QueryData = {
  page?: Page;
  artwork?: Artwork;
};

type LoaderData = {
  type: 'page',
  page: Page;
} | {
  type: 'artwork',
  artwork: Artwork;
};

const query = gql`
  query GetArtwork($slug: String!) {
    page(where: { slug: $slug }) {
      id
      slug
      title
      content
    }
    artwork(where: { slug: $slug }) {
      id
      slug
      title
      technique
      material
      size
      images {
        id
        url
      }
    }
  }
`;

export const loader: LoaderFunction = async ({ params }): Promise<LoaderData> => {
  const { page, artwork } = await graphcms.request<QueryData>(query, { slug: params.slug });
  if (page) {
    page.content = marked(page.content || '');
    return { type: 'page', page };
  } else if (artwork) {
    return { type: 'artwork', artwork };
  } else {
    throw new Response("Not Found", { status: 404 });
  }
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  if (data.type === 'page') {
    return { title: getTitle(data.page.title) };
  } else if (data.type === 'artwork') {
    return { title: getTitle(data.artwork.title) };
  } else {
    return { title: getTitle() };
  }
};

export default function CatchAll() {
  const data = useLoaderData<LoaderData>();
  if (data.type === 'page') {
    return <ContentPage page={data.page} />
  } else if (data.type === 'artwork') {
    return <ArtworkDetailItem artwork={data.artwork} />
  } else {
    return null;
  }
}
