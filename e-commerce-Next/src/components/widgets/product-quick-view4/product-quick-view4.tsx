"use client";

import { Price, PriceValue } from "@/components/widgets/price";
import { Button } from "@/components/base/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/base/dialog";

import { ProductImages } from "./product-images";
import { ProductForm } from "./product-form";
import { PRODUCT_DETAILS } from "./types";
import type { Product } from "./types";

const ProductQuickView4 = ({
  images = PRODUCT_DETAILS.images,
  name = PRODUCT_DETAILS.name,
  description = PRODUCT_DETAILS.description,
  link = PRODUCT_DETAILS.link,
  price = PRODUCT_DETAILS.price,
  hinges = PRODUCT_DETAILS.hinges,
  variant = PRODUCT_DETAILS.variant,
}: Partial<Product>) => {
  const { regular, sale, currency } = price;

  return (
    <Dialog defaultOpen>
      <DialogContent
        style={{
          "--dialog-height": "calc(100dvh - 2.5rem)",
          "--dialog-max-height": "38.75rem",
        } as React.CSSProperties}
        className="block h-dvh w-full max-w-240! rounded-none border-none p-0 md:h-[var(--dialog-height)] md:max-h-[var(--dialog-max-height)]"
      >
        <div className="max-md:hide-scrollbar grid overflow-auto max-md:h-full md:grid-cols-2 md:overflow-hidden">
          <div>
            <ProductImages images={images} />
          </div>
          <div>
            <div className="hide-scrollbar h-full space-y-5 px-8 py-8 md:h-[var(--dialog-height)] md:max-h-[var(--dialog-max-height)] md:overflow-auto md:px-15 md:py-14">
              <div className="space-y-2">
                <DialogTitle className="text-2xl leading-normal font-semibold">{name}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </div>
              <Price onSale={sale != null} className="items-end text-xl font-semibold">
                <PriceValue price={sale} currency={currency} variant="sale" />
                <PriceValue price={regular} currency={currency} variant="regular" />
              </Price>
              <ProductForm hinges={hinges} selected={{ color: variant?.color, size: variant?.size }} product={{ images, name, description, link, price, hinges, variant }} />
              <Button variant="link" className="px-0" render={<a href={link} />} nativeButton={false}>View Product Details</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ProductQuickView4 };
