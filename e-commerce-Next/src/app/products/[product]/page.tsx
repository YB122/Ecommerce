"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Heart } from "lucide-react";
import api from "@/lib/api";
import { ProductDetailSkeleton } from "@/components/widgets/skeletons";
import { Button } from "@/components/base/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { User } from "@/contexts/UserContext";
import { getLocalizedField, parseImageURLs, slugify } from "@/lib/locale";
import { ProductDetail1 } from "@/components/widgets/product-detail1";
import type { ProductDetailData } from "@/components/widgets/product-detail1/types";

interface Product {
  _id: string;
  en_name: string;
  ar_name?: string;
  fr_name?: string;
  en_description: string;
  ar_description?: string;
  fr_description?: string;
  price: number;
  discount: number | null;
  images?: string[];
  imageURLs?: string;
  subcategoryId: string;
  isActive: boolean;
  createdAt: string;
}

async function resolveProduct(param: string): Promise<Product | null> {
  try {
    const res = await api.get(`/products/${param}`);
    return res.data?.data || res.data;
  } catch {
    return null;
  }
}

export default function ProductDetail() {
  const locale = useLocale();
  const { product } = useParams<{ product: string }>();
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { userToken } = useContext(User)!;
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const result = await resolveProduct(product);
      if (!result) router.push("/products");
      else setData(result);
      setLoading(false);
    })();
  }, [product]);

  if (loading) return <ProductDetailSkeleton />;
  if (!data) return null;

  const salePrice = data.discount
    ? data.price - (data.price * data.discount) / 100
    : null;

  const handleToggleWishlist = async () => {
    if (!userToken) { router.push("/login"); return; }
    const alreadyIn = isInWishlist(String(data._id));
    toggleItem({
      _id: String(data._id),
      name: getLocalizedField(data, "name", locale as "en" | "fr" | "ar"),
      image: parseImageURLs(data)[0],
      price: salePrice ?? data.price,
      originalPrice: salePrice ? data.price : undefined,
      inStock: true,
    });
    try {
      if (alreadyIn) {
        await api.delete(`/wishlist/${data._id}`);
      } else {
        await api.post(`/wishlist/${data._id}`);
      }
    } catch {}
  };

  const productData: ProductDetailData = {
    _id: data._id,
    name: getLocalizedField(data, "name", locale as "en" | "fr" | "ar"),
    description: getLocalizedField(data, "description", locale as "en" | "fr" | "ar"),
    price: data.price,
    salePrice,
    originalPrice: data.price,
    currency: "EGP",
    images: parseImageURLs(data),
    locale,
  };

  return (
    <div className="relative">
      <ProductDetail1 product={productData} />
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          variant="outline"
          className="size-11 rounded-full shadow-lg"
          onClick={handleToggleWishlist}
        >
          <Heart
            className={`size-5 ${
              isInWishlist(String(data._id))
                ? "fill-destructive text-destructive"
                : ""
            }`}
          />
        </Button>
      </div>
    </div>
  );
}
