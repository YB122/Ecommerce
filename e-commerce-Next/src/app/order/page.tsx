"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import api from "@/lib/api";
import { User } from "@/contexts/UserContext";

import { Button } from "@/components/base/button";
import { Loading } from "@/app/loading";
import { OrderSummary1 } from "@/components/widgets/order-summary1";

function OrderInner() {
  const t = useTranslations("order");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userToken } = useContext(User)!;
  const [orderData, setOrderData] = useState<unknown>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userToken) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const orderId = searchParams.get("orderId") || searchParams.get("session_id");
        if (orderId) {
          const res = await api.get(`/order/${orderId}`);
          setOrderData(res.data?.data || res.data);
        } else {
          const stored = sessionStorage.getItem("last-order");
          if (stored) {
            setOrderData(JSON.parse(stored));
          }
        }
      } catch {
        try {
          const stored = sessionStorage.getItem("last-order");
          if (stored) {
            setOrderData(JSON.parse(stored));
          }
        } catch {}
      }
      setLoaded(true);
    })();
  }, [userToken]);

  if (!loaded) return null;

  if (!orderData) {
    return (
      <section className="py-32">
        <div className="container max-w-lg text-center">
          <h1 className="mb-4 text-2xl font-semibold">{t("noOrder")}</h1>
          <p className="mb-8 text-muted-foreground">
            {t("noOrderDesc")}
          </p>
          <Button render={<Link href="/products" />} nativeButton={false}>{t("continueShopping")}</Button>
        </div>
      </section>
    );
  }

  const mappedOrder = mapApiOrder(orderData);
  return <OrderSummary1 order={mappedOrder as any} />;
}

function mapApiOrder(data: any) {
  const getImage = (p: any): string => {
    if (typeof p.imageURLs === 'string') { try { const parsed = JSON.parse(p.imageURLs); return Array.isArray(parsed) ? (parsed[0] || "") : ""; } catch {} }
    if (Array.isArray(p.imageURLs)) return p.imageURLs[0] || "";
    return p.images?.[0] || "";
  };
  const items = (data.items || data.products || []).map((item: any) => ({
    _id: String(item.productId || item.product_id || item._id),
    name: item.product?.en_name || item.name || "",
    image: item.product ? getImage(item.product) : item.image || "",
    price: item.price ?? 0,
    quantity: item.quantity ?? 1,
  }));

  return {
    orderNumber: `ORD-${data._id || data.orderId || data.id || Date.now()}`,
    orderDate: data.createdAt
      ? new Date(data.createdAt).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric",
        }),
    status: data.orderStatus || data.status || "confirmed",
    email: data.email || "",
    items,
    subtotal: data.subtotal ?? data.totalAmount ?? 0,
    shipping: data.shippingCost ?? data.shipping ?? 0,
    tax: data.tax ?? 0,
    discount: data.discount,
    total: data.totalAmount ?? data.total ?? 0,
    shippingAddress: {
      name: data.shippingAddress?.fullName || data.shippingAddress?.name || "",
      street: data.shippingAddress?.street || data.shippingAddress?.address || "",
      city: data.shippingAddress?.city || "",
      state: data.shippingAddress?.state || "",
      zipCode: data.shippingAddress?.zipCode || data.shippingAddress?.postalCode || "",
      country: data.shippingAddress?.country || "",
    },
    shippingMethod: "Standard Shipping",
    estimatedDelivery: "5-7 business days",
    paymentMethod: {
      type: data.paymentMethod === "cod" ? "bank" : "card",
      lastFour: data.paymentMethod?.lastFour || "",
      cardBrand: data.paymentMethod?.cardBrand || "",
    },
  };
}

export default function OrderPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderInner />
    </Suspense>
  );
}
