"use client";

import { Controller, useFormContext } from "react-hook-form";
import Image from "next/image";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/base/field";
import { Input } from "@/components/base/input";
import { RadioGroup, RadioGroupItem } from "@/components/base/radio-group";

import { PAYMENT_METHODS, type PaymentMethod } from "./types";

const DateInput = () => {
  const form = useFormContext();

  return (
    <Controller
      name="payment.expiryDate"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            className="text-sm font-normal"
            htmlFor="checkout-payment-expiryDate"
          >
            Expiry Date
          </FieldLabel>
          <Input
            {...field}
            onChange={(e) => {
              let val = e.target.value;
              val = val.replace(/[^0-9/]/g, "");

              const prev = field.value ?? "";
              const isDeleting = val.length < prev.length;

              if (!isDeleting) {
                if (val.length === 2 && !val.includes("/")) {
                  val = val + "/";
                }
              }

              if (val.length > 5) {
                val = val.slice(0, 5);
              }

              field.onChange(val);
            }}
            pattern="^(0[1-9]|1[0-2])/[0-9]{2}$"
            placeholder="MM/YY"
            id="checkout-payment-expiryDate"
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

const PaymentFieldsByMethod = ({ method }: { method: PaymentMethod }) => {
  const form = useFormContext();

  if (!method) return;

  switch (method) {
    case PAYMENT_METHODS.creditCard:
      return (
        <div className="space-y-3.5">
          <Controller
            name="payment.cardholderName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-sm font-normal"
                  htmlFor="checkout-payment-cardholderName"
                >
                  Cardholder Name
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-payment-cardholderName"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="payment.cardNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-sm font-normal"
                  htmlFor="checkout-payment-cardNumber"
                >
                  Card Number
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-payment-cardNumber"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="flex gap-3.5 max-sm:flex-col">
            <DateInput />
            <Controller
              name="payment.cvc"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-sm font-normal"
                    htmlFor="checkout-payment-cvc"
                  >
                    Security Code
                  </FieldLabel>
                  <Input
                    {...field}
                    id="checkout-payment-cvc"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
      );
    case PAYMENT_METHODS.paypal:
      return (
        <Controller
          name="payment.payPalEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-payment-payPalEmail"
              >
                PayPal Email
              </FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder="you-email-here@email.com"
                id="checkout-payment-payPalEmail"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      );
    case PAYMENT_METHODS.onlineBankTransfer:
      return (
        <div className="space-y-3.5">
          <Controller
            name="payment.bankName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-sm font-normal"
                  htmlFor="checkout-payment-bankName"
                >
                  Bank Name
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Bank Name"
                  id="checkout-payment-bankName"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="payment.accountNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-sm font-normal"
                  htmlFor="checkout-payment-accountNumber"
                >
                  Account Number
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-payment-accountNumber"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      );
    default:
      return null;
  }
};

export const PaymentFields = () => {
  const form = useFormContext();
  const paymentMethod = form.watch("payment.method") as PaymentMethod;

  return (
    <div className="space-y-7">
      <Controller
        name="payment.method"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              <FieldLabel htmlFor="checkout-payment-method-1">
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent className="flex-1">
                    <FieldTitle>Credit Card</FieldTitle>
                  </FieldContent>
                  <Image
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/visa-icon.svg"
                    alt="Credit Card"
                    width={20}
                    height={20}
                  />
                  <RadioGroupItem
                    value="creditCard"
                    id="checkout-payment-method-1"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="checkout-payment-method-2">
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent className="flex-1">
                    <FieldTitle>PayPal</FieldTitle>
                  </FieldContent>
                  <Image
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/paypal-icon.svg"
                    alt="PayPal"
                    width={20}
                    height={20}
                  />
                  <RadioGroupItem
                    value="paypal"
                    id="checkout-payment-method-2"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="checkout-payment-method-3">
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldTitle>Online Bank Transfer</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    value="onlineBankTransfer"
                    id="checkout-payment-method-3"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <PaymentFieldsByMethod method={paymentMethod} />
    </div>
  );
};
