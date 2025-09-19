"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't render navbar on recipe pages since they have their own RecipeNavbar
  const isRecipePage = pathname?.startsWith('/recipes/') && pathname !== '/recipes/import';
  
  if (isRecipePage) {
    return null;
  }
  
  return <Navbar />;
}