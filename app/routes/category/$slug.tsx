import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { marked } from "marked";
import { graphcms } from "~/data/graphql.server";
import { Category } from "~/types/categories";
import getTitle from "~/utils/getTitle";
import CategoryDropdown from "~/components/CategoryDropdown";
import ArtworkGrid from "~/components/ArtworkGrid";

interface QueryData {
  categories: Category[];
  category: Category;
}

interface LoaderData {
  categories: Category[];
  category: Category;
}

const query = gql`
  query GetCategory($slug: String!) {
    categories {
      id
      slug
      title
      artworks {
        id
      }
    }
    category(where: { slug: $slug }) {
      id
      slug
      title
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
  }
`;

export const loader: LoaderFunction = async ({ params }): Promise<LoaderData> => {
  const data = await graphcms.request<QueryData>(query, { slug: params.slug });
  data.category.artworks?.forEach((artwork) => {
    artwork.content = marked(artwork.content);
  })
  return data;
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: getTitle(data.category.title) };
};

export default function Category() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="not-prose">
      <CategoryDropdown currentTitle={data.category.title} categories={data.categories} />
      {
        data.category.artworks ? <ArtworkGrid artworks={data.category.artworks} /> : null
      }
    </div>
  )
}
