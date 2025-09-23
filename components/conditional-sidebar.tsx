"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-context";
import { Sidebar } from "@/components/sidebar";

export function ConditionalSidebar() {
  const pathname = usePathname();
  const { status } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Don't render sidebar on recipe pages since they have their own RecipeNavbar
  const isRecipePage =
    pathname?.startsWith("/recipes/") && pathname !== "/recipes/import";

  // Collapse sidebar for unauthenticated users and during loading
  const shouldCollapse = status === "unauthenticated" || status === "loading";

  if (isRecipePage) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md border border-linen-300"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-iron-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={shouldCollapse}
      />
    </>
  );
}
