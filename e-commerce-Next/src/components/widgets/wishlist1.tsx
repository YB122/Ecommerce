"use client";

import { Heart, House, ShoppingCart, Trash2, TrendingDown } from "lucide-react";
import { useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import api from "@/lib/api";

import { AspectRatio } from "@/components/base/aspect-ratio";
import { Badge } from "@/components/base/badge";
import { Button } from "@/components/base/button";
import { Card, CardContent } from "@/components/base/card";
import { Separator } from "@/components/base/separator";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { User } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

interface Wishlist1Props {
  className?: string;
}

const Wishlist1 = ({ className }: Wishlist1Props) => {
  const { items: wishlistItems, removeItem, fetchFromApi } = useWishlist();
  const { addItem } = useCart();
  const { userToken, userRole } = useContext(User)!;

  useEffect(() => {
    if (userToken && userRole) {
      fetchFromApi(userToken, userRole);
    }
  }, [userToken, userRole]);

  const handleRemove = async (_id: string) => {
    removeItem(_id);
    if (userToken) {
      try { await api.delete(`/wishlist/${_id}`); } catch {}
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddAllToCart = () => {
    for (const item of wishlistItems) {
      if (item.inStock) {
        addItem({
          _id: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: 1,
          link: item.link,
        });
      }
    }
  };

  return (
    <motion.section
      className={cn("py-16 md:py-24", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              My Wishlist
            </h1>
            <p className="mt-1 text-muted-foreground">
              {wishlistItems.length} items saved
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" onClick={handleAddAllToCart}>
                <ShoppingCart className="mr-2 size-4" />
                Add All to Cart
              </Button>
            </motion.div>
          )}
        </motion.div>

        {wishlistItems.length > 0 ? (
          <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
              <Card className="group gap-0 overflow-hidden p-0">
                <div className="relative">
                  <AspectRatio ratio={1} className="bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className={cn(
                        "object-cover",
                        !item.inStock && "opacity-50",
                      )}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </AspectRatio>

                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.priceDrop && (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600">
                        <TrendingDown className="mr-1 size-3" />
                        Price Drop
                      </Badge>
                    )}
                    {!item.inStock && (
                      <Badge variant="secondary">Out of Stock</Badge>
                    )}
                  </div>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemove(item._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <h3 className="leading-tight font-medium">{item.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    className="mt-4 w-full"
                    disabled={!item.inStock}
                    variant={item.inStock ? "default" : "secondary"}
                    onClick={() => {
                      if (item.inStock) {
                        addItem({
                          _id: item._id,
                          name: item.name,
                          image: item.image,
                          price: item.price,
                          originalPrice: item.originalPrice,
                          quantity: 1,
                          link: item.link,
                        });
                      }
                    }}
                  >
                    {item.inStock ? "Add to Cart" : "Notify When Available"}
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
          <Separator className="my-12" />
          <div className="text-center">
              <Button render={<Link href="/products" />} nativeButton={false}>
              <House className="mr-2 size-4" />
              Continue Shopping
            </Button>
          </div>
          </>
        ) : (
          <Card className="p-0">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <Heart className="size-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
              <p className="mt-2 max-w-sm text-muted-foreground">
                Save items you love by clicking the heart icon on any product
              </p>
              <Button className="mt-6" render={<Link href="/products" />} nativeButton={false}>Continue Shopping</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.section>
  );
};

export { Wishlist1 };
