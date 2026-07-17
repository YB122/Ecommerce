"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "motion/react";
import api from "@/lib/api";
import { SubcategoryGridSkeleton } from "@/components/widgets/skeletons";
import { Card, CardContent } from "@/components/base/card";
import { getLocalizedField } from "@/lib/locale";
import type { Locale } from "@/lib/locale";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

interface Subcategory {
  _id: string;
  en_name: string;
  ar_name?: string;
  fr_name?: string;
}

export default function CategorySubcategories() {
  const locale = useLocale() as Locale;
  const { category } = useParams<{ category: string }>();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/category/${category}/subcategories`);
        setSubcategories(res.data?.data || res.data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, [category]);

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
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {subcategories.map((sub) => (
          <motion.div key={sub._id} variants={fadeInUp}>
            <Link href={`/subcategories/${sub._id}`}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <h2 className="font-semibold">{getLocalizedField(sub, "name", locale)}</h2>
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
