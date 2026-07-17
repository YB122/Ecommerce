import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NewsletterData = {
  title?: string;
  description?: string;
};

type NewsletterFormProps = NewsletterData;

type FooterLink = {
  text: string;
  link: string;
};

type FooterLinksSectionData = {
  title: string;
  items: FooterLink[];
};

interface FooterLinksSectionProps {
  sections: FooterLinksSectionData[];
}

type SocialIcon = {
  title: string;
  src: string;
  className?: string;
};

type SocialLink = {
  link: string;
  icon: SocialIcon;
};

type ContactLink = {
  icon: LucideIcon;
  text: string;
  type: LinkTypes;
  link?: string;
};

type ContactLinks = {
  contactDetails: ContactLink[];
  socialMedia: SocialLink[];
};

interface ContactSectionProps {
  links: ContactLinks;
}

interface EcommerceFooter1Props {
  newsletter?: NewsletterData;
  footerLinks?: FooterLinksSectionData[];
  contactLinks?: ContactLinks;
  className?: string;
}

const LINK_TYPES = {
  NO_LINK: "NO_LINK",
  PHONE_LINK: "PHONE_LINK",
  EMAIL_LINK: "EMAIL_LINK",
};

type LinkTypes = keyof typeof LINK_TYPES;

const NEWSLETTER_DATA = {
  title: "Newsletter",
  description:
    "Join our newsletter to receive exclusive deals, tech tips, product launches, and early access to the latest electronics.",
};

const FOOTER_LINKS: FooterLinksSectionData[] = [
  {
    title: "Shop",
    items: [
      { text: "All Products", link: "/products" },
      { text: "Categories", link: "/categories" },
      { text: "Subcategories", link: "/subcategories" },
      { text: "Cart", link: "/cart" },
    ],
  },
  {
    title: "Account",
    items: [
      { text: "My Profile", link: "/profile" },
      { text: "My Orders", link: "/orders" },
      { text: "Wishlist", link: "/wishlist" },
    ],
  },
  {
    title: "Support",
    items: [
      { text: "Help Center", link: "#" },
      { text: "Contact Us", link: "/contact" },
      { text: "Privacy Policy", link: "/privacy" },
      { text: "Terms of Service", link: "/terms" },
    ],
  },
];

const SOCIAL_ICONS = {
  facebook: {
    title: "Facebook",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/facebook-icon.svg",
  },
  x: {
    title: "X",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/x.svg",
    className: "dark:invert",
  },
  instagram: {
    title: "Instagram",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/instagram-icon.svg",
  },
};

const CONTACT_LINKS: ContactLinks = {
  contactDetails: [
    {
      icon: Mail,
      text: "support@store.com",
      link: "support@store.com",
      type: LINK_TYPES.EMAIL_LINK as LinkTypes,
    },
    {
      icon: Phone,
      text: "+1 (234) 567-8910",
      link: "+12345678910",
      type: LINK_TYPES.PHONE_LINK as LinkTypes,
    },
    {
      icon: MapPin,
      text: "123 Commerce St, New York, NY",
      type: LINK_TYPES.NO_LINK as LinkTypes,
    },
    {
      icon: Clock,
      text: "Mon - Fri, 9 am - 9 pm",
      type: LINK_TYPES.NO_LINK as LinkTypes,
    },
  ],
  socialMedia: [
    { icon: SOCIAL_ICONS.facebook, link: "#" },
    { icon: SOCIAL_ICONS.x, link: "#" },
    { icon: SOCIAL_ICONS.instagram, link: "#" },
  ],
};

export type {
  NewsletterData,
  NewsletterFormProps,
  FooterLink,
  FooterLinksSectionData,
  FooterLinksSectionProps,
  SocialIcon,
  SocialLink,
  ContactLink,
  ContactLinks,
  ContactSectionProps,
  EcommerceFooter1Props,
  LinkTypes,
};

export {
  LINK_TYPES,
  NEWSLETTER_DATA,
  FOOTER_LINKS,
  SOCIAL_ICONS,
  CONTACT_LINKS,
};
