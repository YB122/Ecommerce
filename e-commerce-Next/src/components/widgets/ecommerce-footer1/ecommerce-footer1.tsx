"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/base/separator";
import { cn } from "@/lib/utils";

import { ContactSection } from "./contact-section";
import { FooterLinksSection } from "./footer-links-section";
import { NewsletterSection } from "./newsletter-section";
import {
  CONTACT_LINKS,
  FOOTER_LINKS,
} from "./types";
import type { EcommerceFooter1Props } from "./types";
import { LocaleSwitcher } from "@/components/widgets/locale-switcher";

const EcommerceFooter1 = ({
  footerLinks = FOOTER_LINKS,
  contactLinks = CONTACT_LINKS,
  className,
}: EcommerceFooter1Props) => {
  const t = useTranslations("footer");

  return (
    <section className={cn("pt-8 pb-8 xl:pt-12", className)}>
      <div className="container mx-auto space-y-10 px-4">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <NewsletterSection
              title={t("newsletter")}
              description={t("newsletterDesc")}
            />
          </div>
          <FooterLinksSection sections={footerLinks} />
          <ContactSection links={contactLinks} />
        </div>
        <div>
          <div className="flex items-center justify-between gap-4 md:gap-12.5">
            <Separator className="flex-1" />
            <div>
              <Link href="/">
                <Image
                  width={150}
                  height={150}
                  src="/logo.jpg"
                  alt="Logo"
                  className="object-contain"
                />
              </Link>
            </div>
            <Separator className="flex-1" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted-foreground max-md:text-xs">
            Copyright © 2026 Store. {t("rights")}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/visa.svg" alt="Visa" width={48} height={24} />
              <Image src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/mastercard.svg" alt="Mastercard" width={48} height={24} />
              <Image src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/amex.svg" alt="American Express" width={48} height={24} />
              <Image src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/paypal.svg" alt="PayPal" width={48} height={24} />
            </div>
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </section>
  );
};

export { EcommerceFooter1 };
