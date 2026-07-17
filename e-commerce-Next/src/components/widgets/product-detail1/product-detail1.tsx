"use client";
import { CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/base/badge";
import { Button } from "@/components/base/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import type { ProductDetail1Props } from "./types";
import { PRODUCT_DETAILS } from "./types";
import { ProductImages } from "./product-images";
import { Reviews } from "./reviews";
import { Price } from "./price";
import { ProductForm } from "./product-form";
import { ProductInfo } from "./product-info";

const ProductDetail1 = ({ className, product }: ProductDetail1Props) => {
  const { addItem } = useCart();
  const router = useRouter();
  const data = product || PRODUCT_DETAILS;

  const images = product
    ? (product.images || []).map((src) => ({
        srcset: `${src} 640w`,
        src,
        alt: product?.name || "",
        width: 640,
        height: 640,
        sizes: "100vw",
      }))
    : (data as typeof PRODUCT_DETAILS).images;

  const name = "name" in data ? data.name : PRODUCT_DETAILS.name;
  const description = "description" in data ? data.description : PRODUCT_DETAILS.description;
  const price = "price" in data ? data.price : PRODUCT_DETAILS.price;
  const inStock = true;
  const priceRegular = typeof price === "number" ? price : price.regular;
  const priceSale = typeof price === "number" ? (product?.salePrice ?? undefined) : price.sale;
  const priceCurrency = typeof price === "number" ? "EGP" : price.currency;

  const handleBuyNow = () => {
    if (product) {
      addItem({
        _id: String(product._id),
        name: product.name,
        image: product.images[0] || "/placeholder.svg",
        price: product.salePrice ?? product.price,
        originalPrice: product.originalPrice,
        quantity: 1,
      });
      router.push("/checkout");
    } else {
      addItem({
        _id: `${PRODUCT_DETAILS.name}-${PRODUCT_DETAILS.color}-${PRODUCT_DETAILS.size}`,
        name: PRODUCT_DETAILS.name,
        image: PRODUCT_DETAILS.images[0].src,
        price: PRODUCT_DETAILS.price.sale ?? PRODUCT_DETAILS.price.regular,
        originalPrice: PRODUCT_DETAILS.price.regular,
        quantity: 1,
        link: "#",
      });
      router.push("/checkout");
    }
  };

  return (
    <section className={cn("py-8", className)}>
      <div className="container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <ProductImages images={images} />
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {data === PRODUCT_DETAILS && (
                      <Reviews
                        rate={(data as typeof PRODUCT_DETAILS).reviews.rate}
                        totalReviewers={(data as typeof PRODUCT_DETAILS).reviews.totalReviewers}
                      />
                    )}
                    <Badge variant={inStock ? "secondary" : "destructive"}>
                      {inStock ? <CircleCheck /> : <CircleX />}
                      {inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
                <Price regular={priceRegular} sale={priceSale} currency={priceCurrency} />
              </div>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <Button size="lg" className="w-full" onClick={handleBuyNow}>Buy Now</Button>
            {data === PRODUCT_DETAILS ? (
              <ProductForm
                hinges={PRODUCT_DETAILS.hinges}
                selected={{ size: PRODUCT_DETAILS.size, color: PRODUCT_DETAILS.color, quantity: 1 }}
              />
            ) : product && (
              <ProductForm
                selected={{ size: "", color: "", quantity: 1 }}
                product={product}
              />
            )}
            {data === PRODUCT_DETAILS && (
              <ProductInfo info={[
                { label: "Material", value: "100% Premium Denim" },
                { label: "Style", value: "Puffer Jacket" },
                { label: "Season", value: "All Season" },
                { label: "Care", value: "Machine Washable" },
                { label: "Origin", value: "Made in Italy" },
                { label: "Fit", value: "Regular Fit" },
              ]} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { ProductDetail1 };
