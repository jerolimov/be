import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { graphcms } from "~/data/graphql.server";
import { Category } from "~/types/categories";
import ArtworkListItem from "~/components/ArtworkListItem";
import getTitle from "~/utils/getTitle";

interface LoaderData {
  category: Category;
}

const query = gql`
  query GetCategory($slug: String!) {
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
          url
        }
      }
    }
  }
`;

export const loader: LoaderFunction = async ({ params }): Promise<LoaderData> => {
  const { category } = await graphcms.request(query, { slug: params.slug });
  return { category };
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return { title: getTitle(data.category.title) };
};

export default function Category() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Kategorie: {data.category.title}</h1>
      <div>
        {data.category.artworks?.map(artwork => (
          <ArtworkListItem key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  )
}
