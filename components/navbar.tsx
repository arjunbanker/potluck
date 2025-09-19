"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/auth-context";

export function Navbar() {
  const { session, status } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <nav className="bg-white shadow-sm border-b border-linen-300">
      <div className="content-left">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 text-iron-900 hover:text-wood-600 transition-colors"
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
              <span className="text-xl font-bold">Potluck</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === "loading" && (
              <div className="w-4 h-4 border-2 border-wood-200 border-t-wood-500 rounded-full animate-spin"></div>
            )}

            {status === "unauthenticated" && (
              <Link
                href="/auth/signin"
                className="bg-wood-500 hover:bg-wood-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}

            {status === "authenticated" && session?.user && (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="text-sm text-iron-700 hover:text-iron-900 font-medium flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
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
                  <span className="hidden sm:inline">My Recipes</span>
                </Link>
                <Link
                  href="/recipes/import"
                  className="bg-sage-500 hover:bg-sage-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
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
                  Import Recipe
                </Link>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-sm text-iron-700 hover:text-iron-900 font-medium p-2 rounded-md hover:bg-linen-100"
                  >
                    <div className="w-8 h-8 bg-linen-200 rounded-full flex items-center justify-center">
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
                    <span className="hidden sm:block">
                      {session.user.email}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
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
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-iron-900 ring-opacity-5 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-linen-200">
                          <p className="text-sm text-iron-900 font-medium">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-sm text-iron-500">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href="/account/settings"
                          onClick={() => setShowUserMenu(false)}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
