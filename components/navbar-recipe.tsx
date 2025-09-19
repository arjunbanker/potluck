"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { PotluckIcon } from "@/components/icons/potluck-icon";
import { useAuth } from "@/components/providers/auth-context";

interface RecipeNavbarProps {
  recipeTitle?: string;
  recipeId?: string;
  onEdit?: () => void;
  onShare?: () => void;
  isOwner?: boolean;
}

export function RecipeNavbar({
  recipeTitle,
  recipeId,
  onEdit,
  onShare,
  isOwner,
}: RecipeNavbarProps) {
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
    <nav className="bg-white shadow-sm border-b border-linen-300 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Minimal Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-wood-600 hover:text-wood-700"
            >
              <PotluckIcon size={28} className="text-wood-600" />
            </Link>
          </div>

          {/* Center: Recipe Title */}
          <div className="flex-1 flex justify-center">
            <div className="max-w-2xl mx-4">
              {recipeTitle && (
                <div className="text-center">
                  <h1 className="text-lg font-semibold text-iron-900 truncate">
                    {recipeTitle}
                  </h1>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions & User Menu */}
          <div className="flex items-center space-x-3">
            {status === "loading" && (
              <div className="text-sm text-iron-500">Loading...</div>
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
              <>
                {/* Recipe Actions */}
                {isOwner && onEdit && onShare && (
                  <div className="flex gap-2">
                    <button
                      onClick={onEdit}
                      className="px-3 py-1.5 text-sm bg-white border border-linen-300 text-iron-700 rounded-md hover:bg-linen-100 flex items-center gap-1"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={onShare}
                      className="px-3 py-1.5 text-sm bg-sage-500 hover:bg-sage-600 text-white rounded-md flex items-center gap-1"
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"
                        />
                      </svg>
                      Share
                    </button>
                  </div>
                )}

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
                          href="/"
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
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            Home
                          </div>
                        </Link>
                        <Link
                          href="/dashboard"
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
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                            My Recipes
                          </div>
                        </Link>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {recipeTitle && (
        <div className="bg-linen-50 border-b border-linen-200">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="py-2">
              <nav className="flex text-sm text-iron-500">
                <Link href="/" className="hover:text-iron-700">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/dashboard" className="hover:text-iron-700">
                  Recipes
                </Link>
                <span className="mx-2">/</span>
                <span className="text-iron-700 truncate">{recipeTitle}</span>
              </nav>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
