import { Link } from "remix";
import { Category } from "~/types/categories";

export default function Navigation({ categories }: { categories: Category[] }) {
  return (
    <nav>
      <ul role="list" aria-label="Kategorien">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/category/${category.slug}/`}
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <span className="truncate">
                {category.title}
              </span>
              <span className="bg-gray-100 text-gray-600 group-hover:bg-gray-200 ml-auto inline-block py-0.5 px-3 text-xs rounded-full">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
