import { LoaderFunction, useLoaderData } from "remix";
import { gql } from "graphql-request";
import { graphcms } from "~/data/graphql.server";
import ArtworkGrid from "~/components/ArtworkGrid";
import CategoryDropdown from "~/components/CategoryDropdown";
import { Artwork } from "~/types/artworks";
import { Category } from "~/types/categories";
import H1 from "~/components/H1";
import H2 from "~/components/H2";
import React from "react";

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
      <H1>BE</H1>
      <CategoryDropdown currentTitle="Alle Bilder" categories={data.categories} />
      <H2>Neuste Kunstwerke</H2>
      {
        data.categories.map((category) => (
          <React.Fragment key={category.id}>
            <H2>{category.title}</H2>
          </React.Fragment>
        ))
      }
      <ArtworkGrid artworks={data.artworks} />
    </div>
  );
}
