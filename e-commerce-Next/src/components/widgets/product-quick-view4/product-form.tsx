import { zodResolver } from "@hookform/resolvers/zod";
import { Heart } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/base/button";
import { FieldLegend, FieldSet } from "@/components/base/field";
import { RadioGroup, RadioGroupItem } from "@/components/base/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

import { STOCK_STATUS, formSchema } from "./types";
import type { FormType, ProductFormProps, RadioGroupProps, SizeOptionProps } from "./types";

export const ProductForm = ({ hinges, selected, product }: ProductFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { color: selected?.color ?? "", size: selected?.size ?? "" },
  });

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  function onSubmit(values: FormType) {
    if (!product) return;
    addItem({
      _id: `${product.name}-${values.color}-${values.size}`,
      name: product.name,
      image: product.images[0]?.src ?? "",
      price: product.price.sale ?? product.price.regular,
      originalPrice: product.price.regular,
      quantity: 1,
      link: product.link,
    });
  }

  const colorHinges = hinges?.color;
  const sizeHinges = hinges?.size;

  const selectedColorValue = form.watch("color");
  const selectedSizeValue = form.watch("size");

  const currentColor = useMemo(
    () => colorHinges?.options?.find((item) => item.value === selectedColorValue)?.label ?? "",
    [selectedColorValue, colorHinges],
  );
  const currentSize = useMemo(
    () => sizeHinges?.options?.find((item) => item.value === selectedSizeValue)?.label ?? "",
    [selectedSizeValue, sizeHinges],
  );

  const productId = product ? `${product.name}-${selectedColorValue}-${selectedSizeValue}` : ""
  const wished = isInWishlist(productId)

  const handleToggleWishlist = () => {
    if (!product) return
    toggleItem({
      _id: productId,
      name: product.name,
      image: product.images[0]?.src ?? "",
      price: product.price.sale ?? product.price.regular,
      originalPrice: product.price.regular,
      inStock: true,
      link: product.link,
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-5">
        {colorHinges && (
          <Controller control={form.control} name={colorHinges.name}
            render={({ field }) => (
              <FieldSet className="gap-2">
                <FieldLegend className="text-sm leading-normal">
                  <h2>{colorHinges.label}: <span className="text-sm font-normal text-muted-foreground">{currentColor}</span></h2>
                </FieldLegend>
                <ColorRadioGroup field={field} options={colorHinges.options} />
              </FieldSet>
            )}
          />
        )}
        {sizeHinges && (
          <Controller control={form.control} name={sizeHinges.name}
            render={({ field }) => (
              <FieldSet className="gap-2">
                <FieldLegend className="text-sm leading-normal">
                  <h2>{sizeHinges.label}: <span className="text-sm font-normal text-muted-foreground">{currentSize}</span></h2>
                </FieldLegend>
                <SizeRadioGroup field={field} options={sizeHinges.options} />
              </FieldSet>
            )}
          />
        )}
        <div className="flex gap-3">
          <Button size="lg" type="submit">Add to Cart</Button>
          <Button size="icon-lg" variant="outline" type="button" onClick={handleToggleWishlist} data-active={wished ? "" : undefined} className="**:data-[active]:fill-destructive **:data-[active]:text-destructive"><Heart /></Button>
        </div>
      </div>
    </form>
  );
};

const ColorRadioGroup = ({ options, field }: RadioGroupProps) => {
  if (!options) return;
  return (
    <RadioGroup {...field} value={field.value} onValueChange={field.onChange} className="flex flex-wrap items-center gap-3">
      {options.map((item, index) => (
        <label key={index} htmlFor={item.id} className="relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-md border p-0.5 duration-400 has-checked:ring has-disabled:opacity-60">
          <RadioGroupItem id={item.id} className="absolute size-px overflow-hidden opacity-0" value={item.value} aria-label={`Select ${item.label}`} disabled={item.stockStatusCode === STOCK_STATUS.OUT_OF_STOCK} />
          <div style={{ backgroundImage: `url(${item.thumbnail})` }} className="size-full overflow-hidden rounded-sm bg-cover bg-center bg-no-repeat"></div>
        </label>
      ))}
    </RadioGroup>
  );
};

const SizeRadioGroup = ({ options, field }: RadioGroupProps) => {
  if (!options) return;
  return (
    <RadioGroup {...field} value={field.value} onValueChange={field.onChange} className="flex w-full flex-wrap justify-start gap-2">
      {options && options.map((item) => (
        <SizeOption key={item.id} stockStatusCode={item.stockStatusCode} id={item.id} label={item.label} value={item.value} />
      ))}
    </RadioGroup>
  );
};

const SizeOption = ({ id, label, stockStatusCode, value }: SizeOptionProps) => {
  return (
    <label htmlFor={id} className="relative flex h-10 min-w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border px-5 py-2.5 text-center text-sm leading-none uppercase not-has-disabled:hover:ring has-checked:bg-primary has-checked:text-primary-foreground has-disabled:cursor-not-allowed has-disabled:bg-muted has-disabled:text-muted-foreground has-disabled:line-through">
      <RadioGroupItem id={id} className="absolute size-px overflow-hidden opacity-0" value={value} aria-label={`Select ${label}`} disabled={stockStatusCode === STOCK_STATUS.OUT_OF_STOCK} />
      {label}
    </label>
  );
};
