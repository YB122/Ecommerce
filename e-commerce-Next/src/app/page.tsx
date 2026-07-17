"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import api from "@/lib/api";
import { HeroSkeleton, CategoryGridSkeleton } from "@/components/widgets/skeletons";
import { Card, CardContent } from "@/components/base/card";
import { getLocalizedField } from "@/lib/locale";
import type { Locale } from "@/lib/locale";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

interface Category {
  _id: string;
  en_name: string;
  ar_name?: string;
  fr_name?: string;
  imageURL: string | null;
}

export default function Home() {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const catRes = await api.get("/category");
        setCategories(catRes.data?.data || catRes.data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-16 py-12">
        <HeroSkeleton />
        <CategoryGridSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-16 py-12">
      <div className="group relative overflow-hidden rounded-lg">
        <img
          src="/504bbe47ea9dbace7fa8c7e8f1858b928464eabe.png"
          alt=""
          className="w-full h-auto transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20">
          <h2 className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-4xl md:text-6xl lg:text-7xl font-['GFS_Didot'] text-white tracking-wide">
            {t("newArrivals")}
          </h2>
        </div>
      </div>

      {categories.length > 0 && (
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            className="mb-6 text-2xl font-semibold"
            variants={fadeInUp}
          >
            {t("categories")}
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, i) => (
              <motion.div key={cat._id} variants={fadeInUp}>
                <Link href={`/categories/${cat._id}`}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="group overflow-hidden">
                      {cat.imageURL && (
                        <div className="relative aspect-square overflow-hidden">
                          <Image src={cat.imageURL} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <h3 className="absolute bottom-6 left-6 px-5 py-2.5 rounded text-2xl md:text-3xl font-bold text-white opacity-100 group-hover:opacity-0 transition-opacity duration-300" style={{ backgroundColor: "#504D4D" }}>
                            {t("shopCategory", { name: getLocalizedField(cat, "name", locale) })}
                          </h3>
                          <h3 className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {getLocalizedField(cat, "name", locale)}
                          </h3>
                        </div>
                      )}
                      {!cat.imageURL && (
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{getLocalizedField(cat, "name", locale)}</h3>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        variants={stagger}
      >
        <motion.h2 className="text-3xl font-bold mb-2" variants={fadeInUp}>
          {t("exploreTitle")}
        </motion.h2>
        <motion.p className="text-muted-foreground mb-8" variants={fadeInUp}>
          {t("exploreSubtitle")}
        </motion.p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { src: "/men1.jpg", key: "urbanEase" },
            { src: "/women1.jpg", key: "softElegance" },
            { src: "/men2.jpg", key: "softElegance" },
            { src: "/kids1.jpg", key: "littleExplorer" },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <div className="group relative overflow-hidden rounded-lg">
                <img
                  src={item.src}
                  alt=""
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="mt-3 text-xl font-semibold text-center">
                {t(item.key as any)}
              </h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <img src="/offer.jpg" alt="" className="w-full rounded-lg" />

    </div>
  );
}
