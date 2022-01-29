import { LoaderFunction } from "remix";
import { gql } from "graphql-request";
import { Feed, Item } from 'feed';
import { graphcms } from "~/data/graphql.server";
import { Category } from "~/types/categories";
import { Artwork } from "~/types/artworks";

const availableMappings: Record<string, {
  method: 'atom1' | 'rss2' | 'json1',
  headers: Record<string, string>
}> = {
  'atom1.xml': {
    method: 'atom1',
    headers: { 'Content-Type': 'application/atom+xml; charset=UTF-8' },
  },
  'rss2.xml': {
    method: 'rss2',
    headers: { 'Content-Type': 'application/rss+xml; charset=UTF-8' },
  },
  'json1.json': {
    method: 'json1',
    headers: { 'Content-Type': 'application/json; charset=UTF-8'},
  },
}

const query = gql`
query {
  categories(orderBy: title_ASC) {
    id
    title
    slug
  }
  artworks(first: 1000, orderBy: sortIndex_DESC) {
    id
    title
    slug
    publishedAt
    importPublishedAt
  }
}
`;

interface QueryData {
  categories: Category[];
  artworks: Artwork[];
}

export const loader: LoaderFunction = async ({ request, params }): Promise<Response> => {
  console.log('availableMappings', availableMappings);
  const mapping = params.type ? availableMappings[params.type] : null;
  if (!mapping) {
    throw new Response("Not Found", { status: 404 });
  }

  const data = await graphcms.request<QueryData>(query);
  const baseURL = process.env.BASE_URL || request.url.substring(0, request.url.indexOf('/feed'));

  console.log(`Create feed with ${data.categories.length} categories and ${data.artworks.length} artworks.`)

  const feed = new Feed({
    id: baseURL,
    title: 'BE',
    link: baseURL,
    description: '',
    copyright: 'BE',
  });
  // feed.categories = data.categories.map((category) => category.slug);
  feed.items = [
    ...data.artworks.map<Item>((artwork) => {
      const published = new Date(artwork.importPublishedAt || artwork.publishedAt);
      return {
        guid: artwork.id,
        title: artwork.title,
        link: `${baseURL}/${artwork.slug}`,
        date: published,
      };
    }),
  ];
  
  const body = feed[mapping.method]();
  return new Response(body, {
    status: 200,
    headers: { ...mapping.headers, 'Content-Length': String(body.length) }
  });
};
