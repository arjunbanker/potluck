"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-context";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useAuth();

  // Don't add padding on recipe pages since they have their own RecipeNavbar
  const isRecipePage =
    pathname?.startsWith("/recipes/") && pathname !== "/recipes/import";

  // Add appropriate padding based on sidebar state
  const getPaddingClass = () => {
    if (isRecipePage) return ""; // No padding for recipe pages
    if (status === "authenticated") return "lg:pl-64"; // Full sidebar padding when authenticated
    return "lg:pl-16"; // Collapsed sidebar padding when not authenticated
  };

  return <div className={getPaddingClass()}>{children}</div>;
}
