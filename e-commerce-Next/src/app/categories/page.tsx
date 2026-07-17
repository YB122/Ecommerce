"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "motion/react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/base/card";
import { CategoryGridSkeleton } from "@/components/widgets/skeletons";
import { getLocalizedField } from "@/lib/locale";
import type { Locale } from "@/lib/locale";

interface Category {
  _id: string;
  en_name: string;
  ar_name?: string;
  fr_name?: string;
  imageURL: string | null;
}

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function CategoriesPage() {
  const locale = useLocale() as Locale;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/category");
        setCategories(res.data?.data || res.data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <CategoryGridSkeleton count={6} />;

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
        Categories
      </motion.h1>
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {categories.map((cat) => (
          <motion.div key={cat._id} variants={fadeInUp}>
            <Link href={`/categories/${cat._id}`}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="overflow-hidden">
                  {cat.imageURL && (
                    <div className="relative aspect-square">
                      <Image src={cat.imageURL} alt={getLocalizedField(cat, "name", locale)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <h2 className="absolute bottom-3 left-3 text-lg font-semibold text-white">{getLocalizedField(cat, "name", locale)}</h2>
                    </div>
                  )}
                  {!cat.imageURL && (
                    <CardContent className="p-4">
                      <h2 className="font-semibold">{getLocalizedField(cat, "name", locale)}</h2>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
