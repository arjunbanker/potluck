"use client"

import { useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to{" "}
              <span className="text-indigo-600">Potluck</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A modern web application with secure email authentication. 
              {session ? ` Welcome back, ${session.user?.email}!` : " Sign in to get started."}
            </p>
            
            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
              {!session && (
                <div className="rounded-md shadow">
                  <a
                    href="/auth/signin"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Get Started
                  </a>
                </div>
              )}
              
              {session && (
                <div className="bg-white rounded-lg shadow px-6 py-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">You're signed in!</h3>
                    <p className="mt-1 text-sm text-gray-500">Ready to explore the app</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="py-12">
          <div className="max-w-7xl mx-auto">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Built with modern technologies
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Email Authentication</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Secure passwordless authentication using magic links sent to your email.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Modern Stack</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Built with Next.js, NextAuth, Drizzle ORM, and PostgreSQL for reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
