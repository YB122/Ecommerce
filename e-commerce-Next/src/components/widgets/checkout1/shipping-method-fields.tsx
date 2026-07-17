"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/base/field";
import { RadioGroup, RadioGroupItem } from "@/components/base/radio-group";

export const ShippingMethodFields = () => {
  const form = useFormContext();

  return (
    <Controller
      name="shippingMethod"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field>
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            className="flex max-sm:flex-col"
          >
            <FieldLabel htmlFor="checkout-shippingMethod-1">
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldTitle>UPS</FieldTitle>
                  <FieldDescription>Delivery: Tomorrow</FieldDescription>
                </FieldContent>
                <div className="flex gap-3.5">
                  <p className="text-sm">$10.00</p>
                  <RadioGroupItem
                    value="UPS"
                    id="checkout-shippingMethod-1"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="checkout-shippingMethod-2">
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldTitle>FedEx</FieldTitle>
                  <FieldDescription>Delivery: Next Week</FieldDescription>
                </FieldContent>
                <div className="flex gap-3.5">
                  <p className="text-sm">$2.99</p>
                  <RadioGroupItem
                    value="FedEx"
                    id="checkout-shippingMethod-2"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
              </Field>
            </FieldLabel>
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
