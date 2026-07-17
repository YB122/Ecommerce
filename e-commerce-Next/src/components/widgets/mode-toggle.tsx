"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { curtains, iris } from "motion-plus-dom/curtains";

import { Button } from "@/components/base/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/base/dropdown-menu";

function useIrisTheme() {
  const { setTheme } = useTheme();

  const switchTheme = React.useCallback(
    async (theme: string) => {
      await curtains(
        () => {
          setTheme(theme);
          return new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
        },
        { effect: iris() },
      );
    },
    [setTheme],
  );

  return switchTheme;
}

export function ModeToggle() {
  const switchTheme = useIrisTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
