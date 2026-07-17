interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
}

interface ActiveFilter {
  sectionId: string;
  optionId: string;
  label: string;
}

const SIZES: FilterSection = {
  id: "size",
  title: "Size",
  options: [
    { id: "xs", label: "XS", count: 18 },
    { id: "s", label: "S", count: 43 },
    { id: "m", label: "M", count: 67 },
    { id: "l", label: "L", count: 55 },
    { id: "xl", label: "XL", count: 39 },
    { id: "xxl", label: "XXL", count: 21 },
  ],
};

const COLORS = [
  { id: "Blue", label: "Blue", hex: "#1B2BFF" },
  { id: "Green", label: "Green", hex: "#1AFF12" },
  { id: "Yellow", label: "Yellow", hex: "#F3FF12" },
  { id: "Orange", label: "Orange", hex: "#FF7512" },
  { id: "Red", label: "Red", hex: "#FF1212" },
  { id: "Pink", label: "Pink", hex: "#FF1BDD" },
  { id: "Navy", label: "Navy", hex: "#1A2B48" },
  { id: "White", label: "White", hex: "#FBFBFB" },
  { id: "Purple", label: "Purple", hex: "#991BFF" },
  { id: "Black", label: "Black", hex: "#0E0E0E" },
];

export type { FilterOption, FilterSection, ActiveFilter };
export { SIZES, COLORS };
