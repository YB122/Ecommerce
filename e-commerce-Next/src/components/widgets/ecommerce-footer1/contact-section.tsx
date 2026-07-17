"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/base/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { LINK_TYPES } from "./types";
import type { ContactSectionProps } from "./types";

const ContactSection = ({ links }: ContactSectionProps) => {
  const t = useTranslations("footer");
  const { socialMedia, contactDetails } = links;

  return (
    <div>
      <h2 className="mb-6 text-sm leading-tight font-medium text-muted-foreground uppercase">{t("contactUs")}</h2>
      <div className="space-y-6">
        <ul className="space-y-3">
          {contactDetails.map((item, i) => (
            <li className="flex items-center gap-3" key={i}>
              <item.icon className="size-4 shrink-0 basis-4" />
              <div className="flex-1">
                  {item.type === LINK_TYPES.NO_LINK ? (
                    <p>{item.text}</p>
                  ) : (
                    <a
                      href={item.type === LINK_TYPES.EMAIL_LINK ? `mailto:${item.link}` : `tel:${item.link}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {item.text}
                    </a>
                  )}
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-3">
          {socialMedia.map(({ icon, link }, i) => (
            <li key={i}>
              <Button size="icon-lg" variant="outline" render={<a href={link} />} nativeButton={false}>
                <Image className={cn(icon.className)} alt={icon.title} src={icon.src} width={20} height={20} />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { ContactSection };
