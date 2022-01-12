import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import getTitle from "~/utils/getTitle";
import styles from "~/tailwind.css";

export const meta: MetaFunction = () => {
  return { title: getTitle() };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
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
