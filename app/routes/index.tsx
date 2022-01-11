import { LoaderFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { marked } from "marked";
import { graphcms } from "~/data/graphql.server";
import ArtworkGrid from "~/components/ArtworkGrid";
import CategoryDropdown from "~/components/CategoryDropdown";
import { Artwork } from "~/types/artworks";
import { Category } from "~/types/categories";

interface QueryData {
  categories: Category[];
  artworks: Artwork[];
}

interface LoaderData {
  categories: Category[];
  artworks: Artwork[];
}

const query = gql`
query {
  categories {
    id
    slug
    title
    artworks {
      id
    }
  }
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
  const { categories, artworks } = await graphcms.request<QueryData>(query);
  artworks.forEach((artwork) => {
    artwork.content = marked(artwork.content);
  })
  return { categories, artworks };
}

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <CategoryDropdown currentTitle="Alle Bilder" categories={data.categories} />
      <ArtworkGrid artworks={data.artworks} />
    </>
  );
}
