import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { marked } from "marked";
import { graphcms } from "~/data/graphql.server";
import { Category } from "~/types/categories";
import ArtworkListItem from "~/components/ArtworkListItem";
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
  }
`;

export const loader: LoaderFunction = async ({ params }): Promise<LoaderData> => {
  const { categories, category } = await graphcms.request<QueryData>(query, { slug: params.slug });
  category.artworks?.forEach((artwork) => {
    artwork.content = marked(artwork.content);
  })
  return { categories, category };
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: getTitle(data.category.title) };
};

export default function Category() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <CategoryDropdown currentTitle={data.category.title} categories={data.categories} />
      <div>
        {data.category.artworks?.map(artwork => (
          <ArtworkListItem key={artwork.id} artwork={artwork} />
        ))}
      </div>
      <ArtworkGrid artworks={data.category.artworks} />
    </div>
  )
}
