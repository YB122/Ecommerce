"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useLocale } from "next-intl";
import { motion } from "motion/react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/base/card";
import { SubcategoryGridSkeleton } from "@/components/widgets/skeletons";
import { getLocalizedField } from "@/lib/locale";
import type { Locale } from "@/lib/locale";

interface Subcategory {
  id: number;
  en_name: string;
  ar_name?: string;
  fr_name?: string;
  category?: { en_name: string };
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export default function SubcategoriesPage() {
  const locale = useLocale() as Locale;
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/subcategory");
        const data: Subcategory[] = res.data?.data || res.data || [];
        const seenLabels = new Set<string>();
        setSubcategories(
          data.filter((s) => {
            const label = getLocalizedField(s, "name", locale);
            if (seenLabels.has(label)) return false;
            seenLabels.add(label);
            return true;
          }),
        );
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <SubcategoryGridSkeleton count={6} />;

  return (
    <motion.section
      className="py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="mb-8 text-3xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Subcategories
      </motion.h1>
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {subcategories.map((sub) => (
          <motion.div key={sub.id} variants={fadeInUp}>
            <Link href={`/subcategories/${sub.id}`}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <h2 className="font-semibold">{getLocalizedField(sub, "name", locale)}</h2>
                    {sub.category && (
                      <p className="text-sm text-muted-foreground">{sub.category.en_name}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
