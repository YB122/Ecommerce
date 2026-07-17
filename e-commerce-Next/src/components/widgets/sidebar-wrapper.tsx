"use client";

import { usePathname } from "next/navigation";
import { EcommerceSidebar } from "@/components/widgets/ecommerce-sidebar";

export function SidebarWrapper() {
  const pathname = usePathname();
  const showSidebar = pathname === "/products";

  if (!showSidebar) return null;

  return <EcommerceSidebar />;
}
