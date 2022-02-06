import { Link } from "remix";

export default function Footer() {
  return (
    <footer className="container mx-auto prose my-10 pt-5 text-center border-t">
      Alle Bilder Urheberrechtlich geschützt.{' '}
      <Link to="/impressum" prefetch="none">Impressum</Link>
    </footer>
  );
}
