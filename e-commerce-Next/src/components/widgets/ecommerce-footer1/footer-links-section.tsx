"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { FooterLinksSectionProps } from "./types";

const FooterLinksSection = ({ sections }: FooterLinksSectionProps) => {
  const t = useTranslations("footer");

  const translateLink = (text: string): string => {
    const keyMap: Record<string, string> = {
      "All Products": "products",
      Categories: "categories",
      Subcategories: "subcategories",
      Cart: "cart",
      "My Profile": "profile",
      "My Orders": "orders",
      Wishlist: "wishlist",
      "Help Center": "customerService",
      "Contact Us": "contactUs",
      "Privacy Policy": "privacy",
      "Terms of Service": "terms",
    };
    return t(keyMap[text] || text);
  };

  const translateTitle = (title: string): string => {
    const keyMap: Record<string, string> = {
      Shop: "quickLinks",
      Account: "profile",
      Support: "customerService",
    };
    return t(keyMap[title] || title);
  };

  return (
    <Fragment>
      {sections.map(({ title, items }, i) => (
        <div key={i}>
          <h2 className="mb-6 text-sm leading-tight font-medium text-muted-foreground uppercase">{translateTitle(title)}</h2>
          <ul className="space-y-3">
            {items.map(({ text, link }, j) => (
              <li key={j}>
                <Link href={link} className="underline-offset-4 hover:underline">{translateLink(text)}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Fragment>
  );
};

export { FooterLinksSection };
