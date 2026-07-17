"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { AspectRatio } from "@/components/base/aspect-ratio";
import { cn } from "@/lib/utils";
import type { ProductImagesProps } from "./types";

const ProductImages = ({ images }: ProductImagesProps) => {
  const [selected, setSelected] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const goNext = useCallback(() => {
    setSelected((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handleSelect = (i: number) => {
    setSelected(i);
    setAutoAdvance(false);
  };

  useEffect(() => {
    if (!autoAdvance || images.length < 2) return;
    const id = setInterval(goNext, 5000);
    return () => clearInterval(id);
  }, [autoAdvance, goNext, images.length]);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg">
        <AspectRatio ratio={1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[selected].src}
                alt={images[selected].alt}
                fill
                sizes={images[selected].sizes}
                className="object-cover object-center"
                priority={selected === 0}
              />
            </motion.div>
          </AnimatePresence>
        </AspectRatio>
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                i === selected
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/30",
              )}
              style={{ width: 72, height: 72 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="72px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { ProductImages };
