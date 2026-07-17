import type { ControllerRenderProps } from "react-hook-form";
import z from "zod";

type StockStatusCode = "IN_STOCK" | "OUT_OF_STOCK";

interface StockInfo {
  stockStatusCode?: StockStatusCode;
  stockQuantity?: number;
}

type option = {
  id: string;
  label: string;
  stockInfo: StockInfo;
  color?: string;
  value: string;
};

const formSchema = z.object({
  color: z.string(),
  quantity: z.number().min(1),
  size: z.string(),
});

type FormType = z.infer<typeof formSchema>;
type FieldName = keyof FormType;

type SizeOptionProps = option;

interface Hinges {
  label: string;
  id: string;
  name: FieldName;
  options?: option[];
  min?: number;
  max?: number;
}

interface ProductImagesProps {
  images: Array<{
    srcset: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes: string;
  }>;
}

interface ReviewsProps {
  rate: number;
  totalReviewers: string;
}

interface PriceProps {
  regular: number;
  sale?: number;
  currency: string;
  text?: string;
}

interface ProductInfoProps {
  info?: Array<{
    label: string;
    value: string;
  }>;
}

interface RadioGroupProps {
  options?: Array<option>;
  field: ControllerRenderProps<FormType>;
}

interface ProductFormProps {
  hinges?: Record<FieldName, Hinges>;
  selected: FormType;
  product?: ProductDetailData;
}

interface ProductDetailData {
  _id: string | number;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  originalPrice: number;
  currency: string;
  images: string[];
  locale: string;
}

interface ProductDetail1Props {
  className?: string;
  product?: ProductDetailData;
}

const MAX_STARS = 5;

const PRODUCT_DETAILS = {
  name: "Urban Chill Jacket",
  color: "blue",
  size: "m",
  reviews: {
    rate: 3.5,
    totalReviewers: "5.8k",
  },
  description:
    "This denim puffer jacket blends warmth and street style, featuring tonal blue shades for a distinctive look that's both bold and versatile. Designed for comfort in any season.",
  price: {
    regular: 80.0,
    sale: 69.0,
    currency: "USD",
  },
  hinges: {
    size: {
      label: "Select size",
      id: "size",
      name: "size",
      options: [
        { id: "xs", label: "xs", value: "xs", stockInfo: { stockStatusCode: "OUT_OF_STOCK" } },
        { id: "s", label: "s", value: "s", stockInfo: { stockStatusCode: "OUT_OF_STOCK" } },
        { id: "m", label: "m", value: "m", stockInfo: { stockStatusCode: "IN_STOCK" } },
        { id: "l", label: "l", value: "l", stockInfo: { stockStatusCode: "IN_STOCK" } },
        { id: "xl", label: "xl", value: "xl", stockInfo: { stockStatusCode: "IN_STOCK" } },
      ],
    },
  } as Record<FieldName, Hinges>,
  images: [
    {
      srcset: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-1.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-3.jpg",
      alt: "", width: 1920, height: 2880,
      sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
    },
    {
      srcset: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-2.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-3.jpg",
      alt: "", width: 1920, height: 2880,
      sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
    },
    {
      srcset: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-1.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-3.jpg",
      alt: "", width: 1920, height: 2880,
      sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
    },
    {
      srcset: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-1.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-3.jpg",
      alt: "", width: 1920, height: 2880,
      sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
    },
  ],
};

export type {
  StockStatusCode,
  StockInfo,
  option,
  Hinges,
  ProductImagesProps,
  ReviewsProps,
  PriceProps,
  ProductInfoProps,
  FormType,
  FieldName,
  SizeOptionProps,
  RadioGroupProps,
  ProductFormProps,
  ProductDetail1Props,
  ProductDetailData,
};

export { formSchema, MAX_STARS, PRODUCT_DETAILS };
