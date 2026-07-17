"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/base/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/base/field";
import { Input } from "@/components/base/input";

export const ContactFields = () => {
  const form = useFormContext();

  return (
    <FieldGroup className="gap-3.5">
      <Controller
        name="contactInfo.email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-normal"
              htmlFor="checkout-email"
            >
              Email
            </FieldLabel>
            <Input
              {...field}
              id="checkout-email"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="contactInfo.subscribe"
        control={form.control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="checkout-subscribe"
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor="checkout-subscribe" className="font-normal">
              Email me with news and offers
            </FieldLabel>
          </Field>
        )}
      />
    </FieldGroup>
  );
};
