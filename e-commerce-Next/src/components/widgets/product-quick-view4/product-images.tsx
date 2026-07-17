import type { ProductImagesProps } from "./types";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/base/carousel";

export const ProductImages = ({ images }: ProductImagesProps) => {
  if (!images) return;
  return (
    <Carousel className="h-full md:[&>div]:h-full">
      <CarouselContent className="-ml-0 md:h-full">
        {images.map((img, index) => (
          <CarouselItem className="w-full pl-0 md:h-[var(--dialog-height)] md:max-h-[var(--dialog-max-height)]" key={index}>
            <div className="relative size-full overflow-hidden max-md:aspect-square">
              <Image src={img.src} alt={img.alt} fill className="object-cover object-center" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1.5" />
      <CarouselNext className="right-1.5" />
    </Carousel>
  );
};
