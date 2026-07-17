"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/base/badge";
import { Checkbox } from "@/components/base/checkbox";
import { Separator } from "@/components/base/separator";
import { cn } from "@/lib/utils";

import { Collapsible } from "./collapsible";
import { COLORS, SIZES } from "./types";
import type { ActiveFilter, FilterSection } from "./types";

function FilterSectionBlock({
  section,
  selected,
  onToggle,
}: {
  section: FilterSection;
  selected: string[];
  onToggle: (sectionId: string, optionId: string, label: string) => void;
}) {
  const t = useTranslations("sidebar");
  return (
    <Collapsible title={t(section.id as "category" | "brand" | "size")}>
      <div className="space-y-2.5">
        {section.options.map((opt) => (
          <label
            key={opt.id}
            className="flex cursor-pointer items-center gap-2.5 group"
          >
            <Checkbox
              id={`${section.id}-${opt.id}`}
              checked={selected.includes(opt.id)}
              onCheckedChange={() => onToggle(section.id, opt.id, opt.label)}
            />
            <span className="flex-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {opt.label}
            </span>
            <span className="text-xs text-muted-foreground/60">
              ({opt.count})
            </span>
          </label>
        ))}
      </div>
    </Collapsible>
  );
}

function ColorPicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const t = useTranslations("sidebar");
  return (
    <Collapsible title={t("color")}>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => {
          const isSelected = selected.includes(color.id);
          return (
            <button
              key={color.id}
              type="button"
              title={color.label}
              onClick={() => onToggle(color.id)}
              className={cn(
                "size-7 rounded-full border-2 transition-all duration-150",
                isSelected
                  ? "scale-110 border-foreground shadow-md"
                  : "border-transparent hover:scale-105 hover:border-muted-foreground/40",
              )}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </Collapsible>
  );
}

function PriceRange({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const t = useTranslations("sidebar");
  return (
    <Collapsible title={t("priceRange")}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">{t("min")}</label>
            <input
              type="number"
              min={0}
              max={value[1]}
              value={value[0]}
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), value[1]);
                onChange([v, value[1]]);
              }}
              className="w-full rounded-md border border-border bg-transparent px-2 py-1 text-sm text-muted-foreground"
            />
          </div>
          <span className="mt-5 text-muted-foreground/40">—</span>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-muted-foreground">{t("max")}</label>
            <input
              type="number"
              min={value[0]}
              max={500}
              value={value[1]}
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), value[0]);
                onChange([value[0], v]);
              }}
              className="w-full rounded-md border border-border bg-transparent px-2 py-1 text-sm text-muted-foreground"
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="rounded-md border border-border px-2 py-1 text-muted-foreground">
            ${value[0]}
          </span>
          <span className="text-muted-foreground/40">—</span>
          <span className="rounded-md border border-border px-2 py-1 text-muted-foreground">
            ${value[1]}
          </span>
        </div>
      </div>
    </Collapsible>
  );
}

function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
}: {
  filters: ActiveFilter[];
  onRemove: (sectionId: string, optionId: string) => void;
  onClearAll: () => void;
}) {
  const t = useTranslations("sidebar");
  if (filters.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {t("active")}
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          {t("clearAll")}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <Badge
            key={`${f.sectionId}-${f.optionId}`}
            variant="secondary"
            className="gap-1 pr-1 text-xs font-normal"
          >
            {f.label}
            <button
              type="button"
              onClick={() => onRemove(f.sectionId, f.optionId)}
              className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 transition-colors p-0.5"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

function SidebarContent({
  checkboxState,
  colorState,
  priceState,
  activeFilters,
  categorySection,
  brandSection,
  onCheckboxToggle,
  onColorToggle,
  onPriceChange,
  onRemoveFilter,
  onClearAll,
}: {
  checkboxState: Record<string, string[]>;
  colorState: string[];
  priceState: [number, number];
  activeFilters: ActiveFilter[];
  categorySection?: FilterSection;
  brandSection?: FilterSection;
  onCheckboxToggle: (sectionId: string, optionId: string, label: string) => void;
  onColorToggle: (id: string) => void;
  onPriceChange: (v: [number, number]) => void;
  onRemoveFilter: (sectionId: string, optionId: string) => void;
  onClearAll: () => void;
}) {
  const t = useTranslations("sidebar");
  return (
    <div className="space-y-1">
      <ActiveFilters
        filters={activeFilters}
        onRemove={onRemoveFilter}
        onClearAll={onClearAll}
      />
      {activeFilters.length > 0 && <Separator className="mb-4" />}
      <div className="space-y-5">
        <FilterSectionBlock
          section={categorySection ?? { id: "category", title: t("category"), options: [] }}
          selected={checkboxState["category"] ?? []}
          onToggle={onCheckboxToggle}
        />
        <Separator />
        <FilterSectionBlock
          section={brandSection ?? { id: "brand", title: t("brand"), options: [] }}
          selected={checkboxState["brand"] ?? []}
          onToggle={onCheckboxToggle}
        />
        <Separator />
        <FilterSectionBlock
          section={SIZES}
          selected={checkboxState["size"] ?? []}
          onToggle={onCheckboxToggle}
        />
        <Separator />
        <ColorPicker selected={colorState} onToggle={onColorToggle} />
        <Separator />
        <PriceRange value={priceState} onChange={onPriceChange} />
      </div>
    </div>
  );
}

export { SidebarContent };
export type { ActiveFilter, FilterSection };
