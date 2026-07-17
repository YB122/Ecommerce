"use client";

import { Trash } from "lucide-react";
import { useCallback } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";

import { AspectRatio } from "@/components/base/aspect-ratio";
import { Button } from "@/components/base/button";
import { Card, CardTitle } from "@/components/base/card";
import { Field } from "@/components/base/field";
import { Price, PriceValue } from "@/components/widgets/price";
import QuantityInput from "@/components/widgets/quantity-input";

import type { CartItem, CartItemProps, CartProps } from "./types";

const ProductDetails = ({
  details,
}: {
  details?: { label: string; value: string }[];
}) => {
  if (!details) return;
  return (
    <ul>
      {details?.map((item, index) => {
        const isLast = index === details.length - 1;
        return (
          <li className="inline" key={`product-details-${index}`}>
            <dl className="inline text-xs text-muted-foreground">
              <dt className="inline">{item.label}: </dt>
              <dd className="inline">{item.value}</dd>
              {!isLast && <span className="mx-1 text-muted-foreground">/</span>}
            </dl>
          </li>
        );
      })}
    </ul>
  );
};

const QuantityField = ({
  index, onQuantityChange,
}: {
  index: number; onQuantityChange: (n: number) => void;
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={`products.${index}.quantity`}
      control={control}
      render={({ field }) => {
        return (
          <Field className="w-full max-w-28">
            <QuantityInput
              inputProps={field}
              onValueChange={(newQty) => {
                field.onChange(newQty);
                onQuantityChange(newQty);
              }}
              className="rounded-none"
            />
          </Field>
        );
      }}
    />
  );
};

const CartItem = ({
  image, name, link, details, price, index, onQuantityChange, onRemoveClick,
}: CartItemProps) => {
  const { regular, currency } = price;

  return (
    <Card className="rounded-none border-none bg-background p-0 shadow-none">
      <div className="flex w-full gap-3.5 max-sm:flex-col">
        <div className="shrink-0 basis-25">
          <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 100px"
              className="object-cover object-center"
            />
          </AspectRatio>
        </div>
        <div className="flex-1">
          <div className="flex flex-col justify-between gap-3">
            <div className="flex w-full justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-sm font-medium">
                  <Link href={link}>{name}</Link>
                </CardTitle>
                <ProductDetails details={details} />
              </div>
              <div>
                <Price className="text-sm font-semibold">
                  <PriceValue
                    price={regular}
                    currency={currency}
                    variant="regular"
                  />
                </Price>
              </div>
            </div>
            <div className="flex w-full justify-between gap-3">
              <QuantityField
                index={index}
                onQuantityChange={onQuantityChange}
              />
              <Button size="icon" variant="ghost" onClick={onRemoveClick}>
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const Cart = ({ cartItems, form }: CartProps) => {
  const { fields, remove, update } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const formItems = form.watch("products");

  const totalPrice = formItems?.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );

  const handleRemove = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove],
  );

  const handleQuantityChange = useCallback(
    (index: number) => (newQty: number) =>
      update(index, { ...fields[index], quantity: newQty }),
    [update, fields],
  );

  if (cartItems.length === 0) {
    return (
      <div>
        <div className="border-b py-7">
          <h2 className="text-lg leading-relaxed font-semibold">Your Cart</h2>
        </div>
        <p className="py-7 text-muted-foreground">Your cart is empty.</p>
      </div>
    );
  }

  const currency = cartItems[0].price.currency;

  return (
    <div>
      <div className="border-b py-7">
        <h2 className="text-lg leading-relaxed font-semibold">Your Cart</h2>
      </div>
      <ul className="space-y-12 py-7">
        {fields.map((field, index) => {
          return (
            <li key={field.id}>
              <CartItem
                {...(cartItems.find(
                  (p) => p.product_id === field.product_id,
                ) as CartItem)}
                onRemoveClick={() => handleRemove(index)()}
                onQuantityChange={(newQty: number) =>
                  handleQuantityChange(index)(newQty)
                }
                index={index}
              />
            </li>
          );
        })}
      </ul>
      <div>
        <div className="space-y-3.5 border-y py-7">
          <div className="flex justify-between gap-3">
            <p className="text-sm">Subtotal</p>
            <Price className="text-sm font-normal">
              <PriceValue
                price={totalPrice}
                currency={currency}
                variant="regular"
              />
            </Price>
          </div>
          <div className="flex justify-between gap-3">
            <p className="text-sm">Shipping</p>
            <p className="text-sm">Free</p>
          </div>
          <div className="flex justify-between gap-3">
            <p className="text-sm">Estimated Tax</p>
            <p className="text-sm">$35.80</p>
          </div>
        </div>
        <div className="py-7">
          <div className="flex justify-between gap-3">
            <p className="text-lg leading-tight font-medium">Total</p>
            <Price className="text-xl font-medium">
              <PriceValue
                price={totalPrice}
                currency={currency}
                variant="regular"
              />
            </Price>
          </div>
        </div>
      </div>
    </div>
  );
};
