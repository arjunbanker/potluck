"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/auth-context";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export function Sidebar({
  isOpen = true,
  onClose,
  isCollapsed = false,
}: SidebarProps) {
  const { session, status } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const isActiveRoute = (route: string) => {
    if (route === "/" && pathname === "/") return true;
    if (route !== "/" && pathname?.startsWith(route)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-linen-300 z-50 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-16 lg:translate-x-0" : "w-64 lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Brand */}
          <div
            className={`border-b border-linen-200 ${isCollapsed ? "p-3" : "p-4"}`}
          >
            <Link
              href="/"
              onClick={handleLinkClick}
              className={`flex items-center text-iron-900 hover:text-wood-600 transition-colors ${
                isCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="text-wood-600"
              >
                <path
                  d="M6 10C6 8.89543 6.89543 8 8 8H16C17.1046 8 18 8.89543 18 10V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V10Z"
                  fill="currentColor"
                  opacity="0.8"
                />
                <path
                  d="M5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H6V11H5Z"
                  fill="currentColor"
                  opacity="0.6"
                />
                <path
                  d="M18 11V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H18Z"
                  fill="currentColor"
                  opacity="0.6"
                />
                <path
                  d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V7C11 7.55228 10.5523 8 10 8C9.44772 8 9 7.55228 9 7V5Z"
                  fill="currentColor"
                  opacity="0.4"
                />
                <path
                  d="M12 3C12 2.44772 12.4477 2 13 2C13.5523 2 14 2.44772 14 3V6C14 6.55228 13.5523 7 13 7C12.4477 7 12 6.55228 12 6V3Z"
                  fill="currentColor"
                  opacity="0.4"
                />
                <path
                  d="M15 5C15 4.44772 15.4477 4 16 4C16.5523 4 17 4.44772 17 5V7C17 7.55228 16.5523 8 16 8C15.4477 8 15 7.55228 15 7V5Z"
                  fill="currentColor"
                  opacity="0.4"
                />
                <circle
                  cx="10"
                  cy="14"
                  r="1.5"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="14"
                  cy="12"
                  r="1"
                  fill="currentColor"
                  opacity="0.3"
                />
                <circle
                  cx="13"
                  cy="16"
                  r="1"
                  fill="currentColor"
                  opacity="0.3"
                />
              </svg>
              {!isCollapsed && (
                <span className="text-xl font-bold">Potluck</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          {!isCollapsed && (
            <nav className="flex-1 p-4 space-y-1">
              <Link
                href="/"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveRoute("/") && pathname === "/"
                    ? "bg-linen-100 text-wood-600"
                    : "text-iron-700 hover:bg-linen-50 hover:text-iron-900"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Home</span>
              </Link>

              {status === "authenticated" && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveRoute("/dashboard")
                        ? "bg-linen-100 text-wood-600"
                        : "text-iron-700 hover:bg-linen-50 hover:text-iron-900"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <span>My Recipes</span>
                  </Link>

                  <Link
                    href="/recipes/import"
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveRoute("/recipes/import")
                        ? "bg-linen-100 text-wood-600"
                        : "text-iron-700 hover:bg-linen-50 hover:text-iron-900"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Import Recipe</span>
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* User Section */}
          {!isCollapsed && (
            <div className="border-t border-linen-200 p-4">
              {status === "loading" && (
                <div className="flex items-center justify-center py-2">
                  <div className="w-4 h-4 border-2 border-wood-200 border-t-wood-500 rounded-full animate-spin"></div>
                </div>
              )}

              {status === "unauthenticated" && (
                <Link
                  href="/auth/signin"
                  onClick={handleLinkClick}
                  className="block w-full bg-wood-500 hover:bg-wood-600 text-white px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
                >
                  Sign In
                </Link>
              )}

              {status === "authenticated" && session?.user && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-linen-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-linen-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-iron-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-iron-900 truncate">
                        {session.user.name ||
                          session.user.email?.split("@")[0] ||
                          "User"}
                      </p>
                      <p className="text-xs text-iron-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform flex-shrink-0 ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-md shadow-lg ring-1 ring-iron-900 ring-opacity-5">
                      <div className="py-1">
                        <Link
                          href="/account/settings"
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLinkClick();
                          }}
                          className="block px-4 py-2 text-sm text-iron-700 hover:bg-linen-100 hover:text-iron-900"
                        >
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Account Settings
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-iron-700 hover:bg-linen-100 hover:text-iron-900"
                        >
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign Out
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
