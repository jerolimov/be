import { Link, LoaderFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { graphcms } from "~/data/graphql.server";
import { Category } from "~/types/categories";

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

export default function Category() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Kategorie: {data.category.title}</h1>
      <div>
        {data.category.artworks?.map(artwork => (
          <div key={artwork.id}>
            <Link to={`/${artwork.slug}`}>
              {artwork.images?.map((image) => (
                <div key={image.id}>
                  <img src={image.url} />
                </div>
              ))}
              <h2>{artwork.title}</h2>
            </Link>
            <div dangerouslySetInnerHTML={{ __html: artwork.content }} />
          </div>
        ))}
      </div>
    </div>
  )
}
