"use client";

import { Heart, LogOut, Menu, Search, ShoppingCart, User as UserIcon, X } from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { User } from "@/contexts/UserContext";
import Cookies from "js-cookie";
import api from "@/lib/api";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/base/accordion";
import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/base/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/base/sheet";
import { LocaleSwitcher } from "@/components/widgets/locale-switcher";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/logo.jpg",
    alt: "logo",
    title: "Store",
  },
  menu: menuProp,
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { userToken, userData, setUserToken, setUserData, setUserRole } = useContext(User)!;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    api.get("/subcategory").then(res => {
      const data = res.data?.data || res.data;
      setSubcategories(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);
  const isLoggedIn = mounted && !!userToken && !!userData;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
      setSearchQuery("");
    }
  };

  const getLocaleName = (item: any) => item[`${locale}_name`] || item.en_name;

  const menu = menuProp ?? [
    { title: t("home"), url: "/" },
    {
      title: t("shop"),
      url: "/products",
      items: [
        { title: t("all"), url: "/products" },
        ...new Map(subcategories.map((sub: any) => [sub.en_name, sub])).values(),
      ].map((sub: any) => ({
        title: sub._id ? getLocaleName(sub) : sub.title,
        url: sub._id ? `/products?subcategory=${sub._id}` : sub.url,
        isAll: !sub._id,
      })),
    },
    { title: t("contactUs"), url: "/contact" },
  ];

  const handleLogout = () => {
    setUserToken(null);
    setUserData(null);
    setUserRole(null);
    Cookies.remove("refreshToken");
    router.push("/");
  };

  return (
    <section className={cn("container mx-auto px-4 py-4", className)}>
        {/* Desktop Menu */}
        <nav className="hidden items-center lg:flex">
          <div className="flex flex-1 justify-start">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <form onSubmit={handleSearch} className="relative mx-4 flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef as any}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search")}
              className="w-full pl-10 pr-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </form>

          <Link href={logo.url} className="mx-auto">
            <Image
              src={logo.src}
              width={120}
              height={120}
              alt={logo.alt}
              className="object-contain"
            />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-2">
            <LocaleSwitcher />
            <CartIcon />
            <WishlistIcon />
            {isLoggedIn ? (
              <>
                <Button size="sm" render={<Link href="/profile" />} nativeButton={false}>
                  <UserIcon className="size-4" />
                  {userData?.name || t("profile")}
                </Button>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  <LogOut className="size-4" />
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" render={<Link href={auth.login.url} />} nativeButton={false}>{auth.login.title}</Button>
                <Button size="sm" render={<Link href={auth.signup.url} />} nativeButton={false}>{auth.signup.title}</Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                width={120}
                height={120}
                alt={logo.alt}
                className="object-contain"
              />
            </Link>
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" />}><Menu className="size-4" /></SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      <Image
                        src={logo.src}
                        width={120}
                        height={120}
                        alt={logo.alt}
                        className="object-contain"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("search")}
                      className="w-full pl-10"
                    />
                  </form>

                  <Accordion
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <LocaleSwitcher />
                      </div>
                    <div className="flex items-center gap-2">
                      <CartIcon />
                      <WishlistIcon />
                    </div>
                    {isLoggedIn ? (
                      <>
                        <Button render={<Link href="/profile" />} nativeButton={false}>
                          <UserIcon className="size-4" />
                          {userData?.name || t("profile")}
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                          <LogOut className="size-4" />
                          {t("logout")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" render={<Link href={auth.login.url} />} nativeButton={false}>{auth.login.title}</Button>
                        <Button render={<Link href={auth.signup.url} />} nativeButton={false}>{auth.signup.title}</Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground p-4">
          <div className="grid grid-cols-5 gap-x-4 gap-y-2">
            {item.items.map((subItem: any) => (
              <NavigationMenuLink key={subItem.title} href={subItem.url} className={`text-sm font-medium hover:text-primary transition-colors ${subItem.isAll ? 'text-primary' : ''}`}>
                {subItem.title}
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 flex flex-col gap-2">
          {item.items.map((subItem: any) => (
            <Link key={subItem.title} href={subItem.url} className={`text-sm font-medium hover:text-primary transition-colors ${subItem.isAll ? 'text-primary' : ''}`}>
              {subItem.title}
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const CartIcon = () => {
  const { itemCount } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return (
    <Link href="/cart" className="relative flex size-10 items-center justify-center rounded-md transition-colors hover:bg-muted">
      <ShoppingCart className="size-5" />
      {mounted && itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  )
}

const WishlistIcon = () => {
  const { items } = useWishlist()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return (
    <Link href="/wishlist" className="relative flex size-10 items-center justify-center rounded-md transition-colors hover:bg-muted">
      <Heart className="size-5" />
      {mounted && items.length > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {items.length > 9 ? "9+" : items.length}
        </span>
      )}
    </Link>
  )
}

export { Navbar1 };
