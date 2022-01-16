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
    <Menu as="div" className="flex flex-col items-center">
      <Menu.Button
        className="flex items-center px-4 py-2 font-medium text-gray-700 hover:bg-gray-200">
        {props.currentTitle}
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </Menu.Button>

      <div className="relative">
        <div className="absolute flex inset-x-0 m-auto justify-center">
          <Transition
            as="div"
            enter="transition ease-out duration-300"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-300"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              as="ol"
              className="py-2 w-56 rounded-md shadow-lg bg-gray-500"
            >
              {props.categories.map((category) => (
                <Menu.Item key={category.id} as="li">
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
            </Menu.Items>
          </Transition>
        </div>
      </div>
    </Menu>
  );
}
