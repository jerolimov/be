import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "remix";
import { gql } from "graphql-request";
import Navigation from "~/components/Navigation";
import { graphcms } from "~/data/graphql.server";
import { Category } from "~/types/categories";
import getTitle from "~/utils/getTitle";
import styles from "~/tailwind.css";

interface LoaderData {
  categories: Category[];
}

export const meta: MetaFunction = () => {
  return { title: getTitle() };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

const query = gql`
  {
    categories {
      id
      slug
      title
      artworks {
        id
      }
    }
  }
`;

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const { categories } = await graphcms.request<{ categories: Category[] }>(query);
  return {
    categories: categories.map((c => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      count: c.artworks?.length,
    }))),
  };
}

export default function App() {
  const data = useLoaderData<LoaderData>();
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="container mx-auto text-center py-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
            <Link to="/">BE</Link>
          </h1>
          <Navigation categories={data.categories} />
        </header>
        <main className="container mx-auto prose prose-slate prose-img:rounded-xl">
          <Outlet />
        </main>
        <footer className="container mx-auto prose my-10 pt-5 text-center border-t">
          Alle Bilder Urheberrechtlich geschützt.{' '}
          <Link to="/impressum" prefetch="none">Impressum</Link>
        </footer>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
