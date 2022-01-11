import { Fragment } from "react";
import { NavLink } from "remix";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Category } from "~/types/categories";

interface CategoryDropdownProps {
  currentTitle: string;
  categories: Category[];
}

export default function CategoryDropdown(props: CategoryDropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          {props.currentTitle}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {props.categories.map((category) => (
              <Menu.Item>
                {({ active }) => (
                  <NavLink
                    to={`/category/${category.slug}/`}
                    className={
                      active
                        ? "bg-gray-100 text-gray-900 block px-4 py-2 text-sm"
                        : "text-gray-700 block px-4 py-2 text-sm"
                    }
                  >
                    {category.title}
                  </NavLink>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
