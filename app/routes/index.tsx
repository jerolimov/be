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
              fit: crop,
              width: 300,
              height: 300,
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
  const data = await graphcms.request<QueryData>(query);
  data.artworks.forEach((artwork) => {
    artwork.content = marked(artwork.content);
  })
  return data;
}

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="not-prose">
      <CategoryDropdown currentTitle="Alle Bilder" categories={data.categories} />
      <ArtworkGrid artworks={data.artworks} />
    </div>
  );
}
