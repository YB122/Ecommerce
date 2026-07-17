"use client";

import { Minus, Plus, Trash2, XCircle } from "lucide-react";
import { useContext, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import api from "@/lib/api";
import { getLocalizedField } from "@/lib/locale";

import { AspectRatio } from "@/components/base/aspect-ratio";
import { Button } from "@/components/base/button";
import { Separator } from "@/components/base/separator";
import { useCart } from "@/contexts/CartContext";
import { User } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

const ShoppingCart1 = () => {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, removeItem, updateQuantity, clearCart, subtotal, shippingCost, total, currency, fetchFromApi } = useCart();
  const { userToken, userRole } = useContext(User)!;
  const router = useRouter();

  useEffect(() => {
    if (userToken && userRole) {
      fetchFromApi(userToken, userRole);
    }
  }, [userToken, userRole]);

  const handleRemove = async (_id: string, color?: string, size?: string) => {
    removeItem(_id);
    if (userToken && color && size) {
      try { await api.delete(`/cart/${_id}/${color}/${size}`); } catch {}
    }
  };

  const handleClearCart = async () => {
    clearCart();
    if (userToken) {
      try { await api.delete("/cart"); } catch {}
    }
  };

  const handleQtyChange = async (_id: string, qty: number, color?: string, size?: string) => {
    updateQuantity(_id, qty);
    if (userToken && qty > 0 && color && size) {
      try { await api.put(`/cart/${_id}/${color}/${size}`, { quantity: qty }); } catch {}
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <section className="py-32">
        <div className="container max-w-lg text-center">
          <h1 className="mb-4 text-2xl font-semibold">{t("empty")}</h1>
          <p className="mb-8 text-muted-foreground">
            {t("emptyHint")}
          </p>
          <Button render={<Link href="/products" />} nativeButton={false}>{t("continueShopping")}</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 container mx-auto">
      <div className="container max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold">{t("title")}</h1>

        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <Link href={`/products/${item.productId || item._id}`} className="w-20 shrink-0">
                <AspectRatio ratio={1} className="overflow-hidden rounded-md">
                  <Image
                    src={item.image}
                    alt={getLocalizedField(item, "name", locale as "en" | "fr" | "ar") || item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </AspectRatio>
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.productId || item._id}`} className="hover:underline">
                  <h3 className="truncate font-medium">{getLocalizedField(item, "name", locale as "en" | "fr" | "ar") || item.name}</h3>
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPrice(item.price)} {t("each")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => handleQtyChange(item._id, item.quantity - 1, item.color, item.size)}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => handleQtyChange(item._id, item.quantity + 1, item.color, item.size)}
                >
                  <Plus className="size-3" />
                </Button>
              </div>

              <div className="w-20 text-right">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground"
                onClick={() => handleRemove(item._id, item.color, item.size)}
              >
                <Trash2 className="size-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleClearCart}>
            <XCircle className="size-4" />
            Clear Cart
          </Button>
        </motion.div>

        <Separator className="my-6" />

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("shipping")}</span>
            <span>{shippingCost > 0 ? formatPrice(shippingCost) : t("free")}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>{t("total")}</span>
            <span>{formatPrice(total)}</span>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="lg" className="w-full" onClick={() => router.push("/checkout")}>
              {t("checkout")}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export { ShoppingCart1 };
