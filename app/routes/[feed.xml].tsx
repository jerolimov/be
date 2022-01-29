import { LoaderFunction } from "remix";
import { gql } from "graphql-request";
import { Feed, Item } from 'feed';
import { graphcms } from "~/data/graphql.server";
import { Category } from "~/types/categories";
import { Artwork } from "~/types/artworks";

const query = gql`
query {
  categories(orderBy: title_ASC) {
    id
    title
    slug
  }
  artworks(orderBy: sortIndex_DESC) {
    id
    title
    slug
  }
}
`;

interface QueryData {
  categories: Category[];
  artworks: Artwork[];
}

export const loader: LoaderFunction = async ({ request }): Promise<Response> => {
  const data = await graphcms.request<QueryData>(query);
  const baseURL = process.env.BASE_URL || request.url.substring(0, request.url.indexOf('/feed'));

  const feed = new Feed({
    id: baseURL,
    title: 'BE',
    link: baseURL,
    description: '',
    copyright: 'BE',
  });
  // feed.categories = data.categories.map((category) => category.slug);
  feed.items = [
    ...data.artworks.map<Item>((artwork) => ({
      guid: artwork.id,
      title: artwork.title,
      link: `${baseURL}/${artwork.slug}`,
      date: new Date(),
    })),
  ];
  
  const xml = feed.rss2();
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      'Content-Length': String(xml.length),
      "xml-version": "1.0",
      "encoding": "UTF-8"
    }
  });
};
