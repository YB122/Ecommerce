"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/base/button";
import { RadioGroup, RadioGroupItem } from "@/components/base/radio-group";
import { useCart } from "@/contexts/CartContext";
import type { FormType, ProductFormProps, RadioGroupProps, SizeOptionProps } from "./types";
import { formSchema, PRODUCT_DETAILS } from "./types";

const ProductForm = ({ hinges, selected, product }: ProductFormProps) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { color: selected?.color, size: selected?.size, quantity: selected?.quantity },
  });

  const { addItem } = useCart();

  function onSubmit(values: FormType) {
    if (product) {
      addItem({
        _id: String(product._id),
        name: product.name,
        image: product.images[0] || "/placeholder.svg",
        price: product.salePrice ?? product.price,
        originalPrice: product.originalPrice,
        quantity: values.quantity,
      });
    } else {
      addItem({
        _id: `${PRODUCT_DETAILS.name}-${values.color}-${values.size}`,
        name: PRODUCT_DETAILS.name,
        image: PRODUCT_DETAILS.images[0].src,
        price: PRODUCT_DETAILS.price.sale ?? PRODUCT_DETAILS.price.regular,
        originalPrice: PRODUCT_DETAILS.price.regular,
        quantity: values.quantity,
        link: "#",
      });
    }
  }

  const sizeHinges = hinges?.size;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {sizeHinges && (
        <Controller
          control={form.control}
          name={sizeHinges.name}
          render={({ field }) => (
            <fieldset className="space-y-3">
              <legend className="text-base font-semibold">{sizeHinges.label}</legend>
              <SizeRadioGroup field={field} options={sizeHinges.options} />
            </fieldset>
          )}
        />
      )}
      <Button type="submit" size="lg" className="w-full">Add to Cart</Button>
    </form>
  );
};

const SizeRadioGroup = ({ options, field }: RadioGroupProps) => {
  if (!options) return;
  return (
    <RadioGroup
      {...field}
      value={`${field.value}`}
      onValueChange={(value) => { if (value != field.value && value) field.onChange(value); }}
      className="flex flex-wrap gap-3"
    >
      {options.map((item, index) => (
        <SizeOption key={`product-detail-1-size-input-${index}`} stockInfo={item.stockInfo} id={item.id} label={item.label} value={item.value} />
      ))}
    </RadioGroup>
  );
};

const SizeOption = ({ id, label, stockInfo, value }: SizeOptionProps) => {
  const isOutOfStock = stockInfo.stockStatusCode === "OUT_OF_STOCK";
  return (
    <label htmlFor={id} className="relative flex h-10 w-16 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground has-checked:bg-primary has-checked:text-primary-foreground has-disabled:pointer-events-none has-disabled:opacity-50">
      <RadioGroupItem id={id} className="absolute size-px overflow-hidden opacity-0" value={value} disabled={isOutOfStock} />
      <span className="uppercase">{label}</span>
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-full rotate-45 bg-border"></div>
        </div>
      )}
    </label>
  );
};

export { ProductForm };
