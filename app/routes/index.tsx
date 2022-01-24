import { LoaderFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
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
  categories(orderBy: title_ASC) {
    id
    slug
    title
    artworks {
      id
    }
  }
  artworks(orderBy: sortIndex_DESC) {
    id
    slug
    title
    technique
    material
    size
    images {
      id
      width
      height
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
