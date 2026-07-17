"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import z from "zod";

import { Button } from "@/components/base/button";
import { Field, FieldError } from "@/components/base/field";
import { Input } from "@/components/base/input";

import type { NewsletterFormProps } from "./types";

const newsletterFormSchema = z.object({
  email: z.string().email(),
});

type newsletterFormType = z.infer<typeof newsletterFormSchema>;

const NewsletterSection = ({ title, description }: NewsletterFormProps) => {
  const t = useTranslations("footer");
  const form = useForm({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: newsletterFormType) => {
    console.log(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-serif text-3xl leading-none font-medium">{title}</h3>
        <p className="leading-normal font-light">{description}</p>
      </div>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input {...field} aria-invalid={fieldState.invalid} placeholder={t("newsletterDesc")} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button className="w-full">{t("subscribe")}</Button>
      </form>
    </div>
  );
};

export { NewsletterSection };
