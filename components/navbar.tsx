"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Potluck
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === "loading" && (
              <div className="text-sm text-gray-500">Loading...</div>
            )}
            
            {status === "unauthenticated" && (
              <Link
                href="/auth/signin"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}

            {status === "authenticated" && session?.user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  {session.user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}