"use client";

import { useState, useEffect } from "react";
import { Palette } from "lucide-react";

import { Button } from "@/components/base/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/base/dropdown-menu";
import { cn } from "@/lib/utils";

const THEMES = [
  { name: "Blue", value: "blue", color: "oklch(0.55 0.22 260)", hue: 260 },
  { name: "Green", value: "green", color: "oklch(0.55 0.22 160)", hue: 160 },
  { name: "Purple", value: "purple", color: "oklch(0.55 0.22 300)", hue: 300 },
  { name: "Orange", value: "orange", color: "oklch(0.65 0.2 50)", hue: 50 },
  { name: "Rose", value: "rose", color: "oklch(0.55 0.22 0)", hue: 0 },
  { name: "Black", value: "black", color: "oklch(0.1 0 0)", hue: 0 },
] as const;

export function ColorThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("color-theme");
    if (saved) {
      setCurrentTheme(saved);
      applyTheme(saved);
    }
  }, []);

  function applyTheme(theme: string) {
    if (theme === "default") {
      document.documentElement.removeAttribute("data-color-theme");
      document.documentElement.style.removeProperty("--primary");
      document.documentElement.style.removeProperty("--primary-foreground");
      document.documentElement.style.removeProperty("--ring");
      return;
    }

    document.documentElement.setAttribute("data-color-theme", theme);

    const themeConfig = THEMES.find((t) => t.value === theme);
    if (themeConfig) {
      document.documentElement.style.setProperty("--primary", themeConfig.color);
      document.documentElement.style.setProperty(
        "--primary-foreground",
        "oklch(0.98 0 0)",
      );
      document.documentElement.style.setProperty(
        "--ring",
        `oklch(0.6 0.15 ${themeConfig.hue})`,
      );
    }
  }

  function selectTheme(value: string) {
    setCurrentTheme(value);
    localStorage.setItem("color-theme", value);
    applyTheme(value);
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Color theme" />
        }
      >
        <Palette className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme Color</DropdownMenuLabel>
        </DropdownMenuGroup>
        <div className="grid grid-cols-6 gap-3 px-2 py-2 mx-auto ">
          {THEMES.map((theme) => (
            <button
              key={theme.value}
              onClick={() => selectTheme(theme.value)}
              className={cn(
                "size-8 cursor-pointer rounded-full border-2 transition-all hover:scale-110",
                currentTheme === theme.value
                  ? "border-foreground scale-110"
                  : "border-transparent",
              )}
              style={{ backgroundColor: theme.color }}
              title={theme.name}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
