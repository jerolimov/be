import { Link } from "remix";
import { Category } from "~/types/categories";

export default function Navigation({ categories }: { categories: Category[] }) {
  return (
    <nav>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={`/category/${category.slug}/`}>
              {category.title} ({category.count})
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
