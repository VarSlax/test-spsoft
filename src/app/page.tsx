import { PaginationList } from "@/_components/PaginationList";
import {
  Dropdown,
  DropdownItem,
  DropdownSubmenu,
} from "@/_components/Dropdown";

const dropdownOptionsWithMenu = [
  {
    label: "1aasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd",
    value: "item1",
  },
  { label: "Item 2", value: "item2" },
  {
    label: "More",
    value: "more",
    children: [
      { label: "Sub Item 1", value: "subitem1" },
      { label: "Sub Item 2", value: "subitem2" },
    ],
  },
];

const dropdownOptionsWithoutMenu = [
  {
    label: "Item 1aasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd",
    value: "item1",
  },
  { label: "Item 2", value: "item2" },
  { label: "Item 3", value: "item3" },
  { label: "Item 4", value: "item4" },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-evenly bg-gradient-to-b from-[#2e026d] to-[#15162c] p-10 text-white">
      <PaginationList />
      <Dropdown initialValue="WithMenu" triggerClassName="min-w-[200px]">
        {dropdownOptionsWithMenu.map((item) =>
          item.children ? (
            <DropdownSubmenu key={item.value} label={item.label}>
              {item.children.map((subItem) => (
                <DropdownItem key={subItem.value} item={subItem} />
              ))}
            </DropdownSubmenu>
          ) : (
            <DropdownItem key={item.value} item={item} />
          ),
        )}
      </Dropdown>

      <Dropdown initialValue="WithoutMenu" triggerClassName="min-w-[200px]">
        {dropdownOptionsWithoutMenu.map((item) => (
          <DropdownItem key={item.value} item={item} />
        ))}
      </Dropdown>
    </main>
  );
}
