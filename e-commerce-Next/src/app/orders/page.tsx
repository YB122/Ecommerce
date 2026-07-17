"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "@/lib/locale";
import { useFormatPrice } from "@/lib/locale";
import api from "@/lib/api";
import { User } from "@/contexts/UserContext";
import { Badge } from "@/components/base/badge";
import { Button } from "@/components/base/button";
import { Card, CardContent } from "@/components/base/card";
import { Skeleton } from "@/components/base/skeleton";

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  total: number;
  totalAmount?: number;
  createdAt: string;
}

export default function OrdersPage() {
  const t = useTranslations("orders");
  const locale = useLocale() as Locale;
  const formatPrice = useFormatPrice(locale);
  const { userToken } = useContext(User)!;
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userToken) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const res = await api.get("/order/mine");
        const raw = res.data?.data || res.data;
        const data = raw?.orders || raw;
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, [userToken]);

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: "secondary",
      processing: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    return (map[status] || "secondary") as "default" | "secondary" | "destructive";
  };

  if (loading) {
    return (
      <section className="py-8">
        <Skeleton className="mb-8 h-8 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="ml-auto h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-muted-foreground">{t("empty")}</p>
          <Button className="mt-4" render={<Link href="/products" />} nativeButton={false}>
            {t("startShopping")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} href={`/order?orderId=${order._id}`}>
              <Card className="transition-opacity hover:opacity-90">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{t("orderId", { id: order._id })}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.totalAmount ?? order.total)}</p>
                    <Badge variant={statusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
