"use client";

import { useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, SlidersHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Badge } from "@/components/base/badge";
import { Button } from "@/components/base/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/base/sheet";
import { getLocalizedField } from "@/lib/locale";
import type { Locale } from "@/lib/locale";
import api from "@/lib/api";

import { SidebarContent, type ActiveFilter, type FilterSection } from "./filters";
import { COLORS, SIZES } from "./types";

export function EcommerceSidebar() {
  const locale = useLocale() as Locale;
  const t = useTranslations("sidebar");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [checkboxState, setCheckboxState] = useState<Record<string, string[]>>(() => {
    const sub = searchParams.get("subcategory");
    return sub ? { brand: [sub] } : {};
  });
  const [colorState, setColorState] = useState<string[]>([]);
  const [priceState, setPriceState] = useState<[number, number]>([0, 500]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [categories, setCategories] = useState<FilterSection>({ id: "category", title: t("category"), options: [] });
  const [subcategories, setSubcategories] = useState<FilterSection>({ id: "brand", title: t("brand"), options: [] });

  useEffect(() => {
    (async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          api.get("/category"),
          api.get("/subcategory"),
        ]);
        const catData = catRes.data?.data || catRes.data || [];
        const subData = subRes.data?.data || subRes.data || [];
        setCategories({
          id: "category",
          title: t("category"),
          options: catData.map((c: { id: number; en_name: string; ar_name?: string; fr_name?: string }) => ({
            id: String(c.id),
            label: getLocalizedField(c, "name", locale),
            count: 0,
          })),
        });
        const brandOptions = Array.from(
          new Map(subData.map((s: any) => [s.en_name, s])).values()
        ).map((s: any) => ({
          id: String(s.id),
          label: getLocalizedField(s, "name", locale),
          count: 0,
        }));
        setSubcategories({
          id: "brand",
          title: t("brand"),
          options: brandOptions,
        });
      } catch {
        // silent
      }
    })();
  }, []);

  const sections = [categories, subcategories, SIZES];

  const activeFilters: ActiveFilter[] = [
    ...Object.entries(checkboxState).flatMap(([sectionId, ids]) =>
      ids.map((optionId) => {
        const section = sections.find((s) => s.id === sectionId);
        const option = section?.options.find((o) => o.id === optionId);
        return { sectionId, optionId, label: option?.label ?? optionId };
      }),
    ),
    ...colorState.map((id) => ({
      sectionId: "color",
      optionId: id,
      label: COLORS.find((c) => c.id === id)?.label ?? id,
    })),
  ];

  function handleCheckboxToggle(sectionId: string, optionId: string, _label: string) {
    setCheckboxState((prev) => {
      const current = prev[sectionId] ?? [];
      const next = {
        ...prev,
        [sectionId]: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
      if (sectionId === "brand") {
        const params = new URLSearchParams(searchParams.toString());
        const selected = next.brand ?? [];
        if (selected.length > 0) {
          params.set("subcategory", selected[selected.length - 1]);
        } else {
          params.delete("subcategory");
        }
        router.replace(`${pathname}?${params}`, { scroll: false });
      }
      return next;
    });
  }

  function handleColorToggle(id: string) {
    setColorState((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  function handleRemoveFilter(sectionId: string, optionId: string) {
    if (sectionId === "color") {
      setColorState((prev) => prev.filter((c) => c !== optionId));
    } else {
      setCheckboxState((prev) => {
        const next = {
          ...prev,
          [sectionId]: (prev[sectionId] ?? []).filter((id) => id !== optionId),
        };
        if (sectionId === "brand") {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("subcategory");
          router.replace(`${pathname}?${params}`, { scroll: false });
        }
        return next;
      });
    }
  }

  function handleClearAll() {
    setCheckboxState({});
    setColorState([]);
    setPriceState([0, 500]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("subcategory");
    router.replace(`${pathname}?${params}`, { scroll: false });
  }

  const sharedProps = {
    checkboxState,
    colorState,
    priceState,
    activeFilters,
    categorySection: categories,
    brandSection: subcategories,
    onCheckboxToggle: handleCheckboxToggle,
    onColorToggle: handleColorToggle,
    onPriceChange: setPriceState,
    onRemoveFilter: handleRemoveFilter,
    onClearAll: handleClearAll,
  };

  return (
    <>
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="size-4" />
                {t("filters")}
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            }
          />
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="border-b px-5 py-4">
              <SheetTitle className="text-left text-sm font-semibold tracking-widest uppercase">
                {t("filters")}
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-auto h-[calc(100vh-64px)] px-5 py-5">
              <SidebarContent {...sharedProps} />
              <div className="mt-6 pb-2">
                <Button className="w-full" onClick={() => setMobileOpen(false)}>
                  {t("showResults")}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:flex gap-0">
        <aside
          className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${
            desktopOpen ? 'max-w-60' : 'max-w-0'
          }`}
        >
          <div className="w-60">
            <div className="sticky top-6">
              <div className="mb-5 flex items-center justify-between pr-2">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground">
                  {t("filters")}
                </h2>
                <button
                  type="button"
                  onClick={() => setDesktopOpen(false)}
                  className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                >
                  <PanelLeftClose className="size-4" />
                </button>
              </div>
              <div className="overflow-auto max-h-[calc(100vh-120px)] pr-2">
                <SidebarContent {...sharedProps} />
              </div>
            </div>
          </div>
        </aside>
        <button
          type="button"
          onClick={() => setDesktopOpen(true)}
          className={`sticky top-6 self-start mt-1 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground transition-all duration-300 p-0.5 ${
            desktopOpen ? 'opacity-0 pointer-events-none w-0' : 'opacity-100 w-auto'
          }`}
          title={t("showFilters")}
        >
          <PanelLeftOpen className="size-4" />
        </button>
      </div>
    </>
  );
}

export default EcommerceSidebar;
