import { LoaderFunction, useLoaderData } from "remix";
import { categories } from "~/data/categories.server";
import { Category } from "~/types/categories";

interface LoaderData {
  category: Category;
}

export const loader: LoaderFunction = ({ params }): LoaderData => {
  const category = categories.find(c => c.slug === params.slug);
  if (!category) {
    throw new Response("Not Found", { status: 404 });  
  }
  return { category };
}

export default function Category() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Kategorie: {data.category.title}</h1>
      <div>
        Todo: {data.category.count} artworks
      </div>
    </div>
  )
}
