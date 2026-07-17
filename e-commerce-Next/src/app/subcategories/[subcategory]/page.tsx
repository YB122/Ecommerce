"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import api from "@/lib/api";
import { Badge } from "@/components/base/badge";
import { ProductGridSkeleton } from "@/components/widgets/skeletons";
import { Card, CardContent, CardHeader } from "@/components/base/card";
import { AspectRatio } from "@/components/base/aspect-ratio";
import { getLocalizedField, parseImageURLs, useFormatPrice } from "@/lib/locale";
import type { Locale } from "@/lib/locale";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

interface Product {
  _id: string;
  en_name: string;
  ar_name?: string;
  fr_name?: string;
  price: number;
  discount: number | null;
  images?: string[];
  imageURLs?: string;
}

interface SubcategoryInfo {
  _id: string;
  en_name: string;
  ar_name?: string;
  fr_name?: string;
  categoryId: string;
}

interface SidebarSubcategory {
  _id: string;
  en_name: string;
  ar_name?: string;
  fr_name?: string;
}

export default function SubcategoryProducts() {
  const t = useTranslations("subcategories");
  const locale = useLocale() as Locale;
  const { subcategory } = useParams<{ subcategory: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [sidebarSubs, setSidebarSubs] = useState<SidebarSubcategory[]>([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = useFormatPrice(locale);

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, subRes] = await Promise.all([
          api.get(`/products/subcategory/${subcategory}`),
          api.get(`/subcategory/${subcategory}`),
        ]);

        const prodData = prodRes.data?.data?.products || prodRes.data?.data || prodRes.data;
        setProducts(Array.isArray(prodData) ? prodData : []);

        const subInfo: SubcategoryInfo = subRes.data?.data || subRes.data;
        if (subInfo?.categoryId) {
          const catRes = await api.get(`/category/${subInfo.categoryId}/subcategories`);
          const subs: SidebarSubcategory[] = catRes.data?.data || catRes.data || [];
          setSidebarSubs(Array.isArray(subs) ? subs : []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, [subcategory]);

  if (loading) return <ProductGridSkeleton count={8} />;

  return (
    <motion.section
      className="py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="mb-8 text-3xl font-bold capitalize"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("title")}
      </motion.h1>
      <div className="flex gap-8">
        {sidebarSubs.length > 0 && (
          <motion.aside
            className="hidden w-56 shrink-0 lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <nav className="sticky top-24 space-y-1">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                {t("browse")}
              </p>
              {sidebarSubs.map((sub) => {
                const isActive = sub._id === subcategory;
                return (
                  <Link
                    key={sub._id}
                    href={`/subcategories/${sub._id}`}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {getLocalizedField(sub, "name", locale)}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        )}
        <div className="flex-1">
          {products.length === 0 ? (
            <motion.p
              className="text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t("noProducts")}
            </motion.p>
          ) : (
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              {products.map((product) => {
                const salePrice = product.discount
                  ? product.price - (product.price * product.discount) / 100
                  : null;
                return (
                  <motion.div key={product._id} variants={fadeInUp}>
                    <Link href={`/products/${product._id}`}>
                      <motion.div
                        whileHover={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="h-full overflow-hidden">
                          <CardHeader className="relative block p-0">
                            <AspectRatio ratio={1}>
                              <Image
                                src={parseImageURLs(product)[0]}
                                alt={getLocalizedField(product, "name", locale)}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </AspectRatio>
                            {product.discount && (
                              <Badge className="absolute left-3 top-3">-{product.discount}%</Badge>
                            )}
                          </CardHeader>
                          <CardContent className="p-4">
                            <h3 className="truncate font-medium">{getLocalizedField(product, "name", locale)}</h3>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="font-semibold">
                                {formatPrice(salePrice ?? product.price)}
                              </span>
                              {salePrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(product.price)}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
