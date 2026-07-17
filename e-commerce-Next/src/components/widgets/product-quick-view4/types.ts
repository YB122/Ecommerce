import type { ControllerRenderProps } from "react-hook-form";
import z from "zod";

export const STOCK_STATUS = {
  IN_STOCK: "IN_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;

export type StockStatusCode = keyof typeof STOCK_STATUS;

export const formSchema = z.object({
  color: z.string(),
  size: z.string(),
});

export type FormType = z.infer<typeof formSchema>;
export type FieldName = keyof FormType;

export type Image = {
  src: string;
  alt: string;
};

export interface ProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

export type Option = {
  id: string;
  value: string;
  label: string;
  thumbnail?: string;
  stockStatusCode?: StockStatusCode;
};

export interface Hinges {
  label: string;
  id: string;
  min?: number;
  max?: number;
  name: FieldName;
  options?: Option[];
}

export type Product = {
  images: Image[];
  name: string;
  description: string;
  link: string;
  price: ProductPrice;
  hinges: Record<FieldName, Hinges>;
  variant: {
    color: string;
    size: string;
  };
};

export interface ProductImagesProps {
  images: Image[];
}

export interface ProductFormProps {
  hinges: Record<FieldName, Hinges>;
  selected?: FormType;
  product?: Product;
}

export interface RadioGroupProps {
  options?: Array<Option>;
  field: ControllerRenderProps<FormType>;
}

export type SizeOptionProps = Option;

export const PRODUCT_DETAILS: Product = {
  name: "Stylish Light Brown Hat",
  description: "We craft gentle formulas that truly work and bring confidence to your daily ritual",
  link: "#",
  images: [
    { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Hat-and-Sunglasses-2.png", alt: "" },
    { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Portrait-hat-2.png", alt: "" },
    { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Modern-Look-2.png", alt: "" },
    { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Fashionable-Pose-2.png", alt: "" },
  ],
  price: { regular: 499.0, sale: 389.0, currency: "USD" },
  variant: { color: "light-brown", size: "size-1" },
  hinges: {
    color: {
      label: "Color", id: "color", name: "color",
      options: [
        { id: "light-brown", value: "light-brown", label: "Light Brown", thumbnail: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Beige-Fedora-1.png", stockStatusCode: "IN_STOCK" },
        { id: "dark-brown", value: "dark-brown", label: "Dark Brown", thumbnail: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Fedora-Hat-1.png", stockStatusCode: "IN_STOCK" },
        { id: "black", value: "black", label: "Black", thumbnail: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Black-Fedora-Hat-1.png", stockStatusCode: "OUT_OF_STOCK" },
      ],
    },
    size: {
      label: "Hat Size", id: "size", name: "size",
      options: [
        { id: "size-1", value: "size-1", label: "6⅝", stockStatusCode: "IN_STOCK" },
        { id: "size-2", value: "size-2", label: "6¾", stockStatusCode: "IN_STOCK" },
        { id: "size-3", value: "size-3", label: "6⅞", stockStatusCode: "OUT_OF_STOCK" },
        { id: "size-4", value: "size-4", label: "7", stockStatusCode: "OUT_OF_STOCK" },
        { id: "size-5", value: "size-5", label: "7⅛", stockStatusCode: "IN_STOCK" },
        { id: "size-6", value: "size-6", label: "7¼", stockStatusCode: "OUT_OF_STOCK" },
        { id: "size-7", value: "size-7", label: "7⅜", stockStatusCode: "IN_STOCK" },
        { id: "size-8", value: "size-8", label: "7½", stockStatusCode: "IN_STOCK" },
      ],
    },
  },
};
