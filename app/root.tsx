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
import globalStyles from "~/styles/global.css";
import Navigation from "~/navigation";
import { categories } from "~/data/categories.server";
import { Category } from "~/types/categories";

interface LoaderData {
  categories: Category[];
}

export const meta: MetaFunction = () => {
  return { title: "BE" };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: globalStyles }];
}

export const loader: LoaderFunction = ({ params }): LoaderData => {
  return { categories };
}

export default function App() {
  const data = useLoaderData<LoaderData>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <h1><Link to="/">BE</Link></h1>
          <Navigation categories={data.categories} />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
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
