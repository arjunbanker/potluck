"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const _router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setMessage("Error sending email. Please try again.");
      } else {
        setMessage("Check your email for the magic link!");
      }
    } catch (_error) {
      setMessage("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="signin-split bg-linen-50">
      {/* Left side - Sign in form */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <svg
                width="32"
                height="32"
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
                <circle cx="10" cy="14" r="1.5" fill="currentColor" opacity="0.3" />
                <circle cx="14" cy="12" r="1" fill="currentColor" opacity="0.3" />
                <circle cx="13" cy="16" r="1" fill="currentColor" opacity="0.3" />
              </svg>
              <span className="text-2xl font-bold text-iron-900">Potluck</span>
            </div>
            <h2 className="text-3xl font-bold text-iron-900">
              Welcome back
            </h2>
            <p className="mt-2 text-iron-600">
              Enter your email to receive a magic link and sign in
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-iron-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-linen-300 placeholder-iron-500 text-iron-900 focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-wood-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-wood-500 hover:bg-wood-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood-500 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Sending magic link..." : "Send magic link"}
              </button>
            </div>

            {message && (
              <div className="mt-4 p-4 rounded-md bg-sage-50 border border-sage-200">
                <div className="text-sm text-sage-800">
                  {message}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right side - Branding/Info */}
      <div className="hidden lg:flex bg-wood-500 items-center justify-center p-8">
        <div className="max-w-md text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Join the Community</h3>
          <p className="text-wood-100 mb-6">
            Discover amazing recipes, share your favorites, and connect with fellow home cooks from around the world.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-wood-200">Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5K+</div>
              <div className="text-wood-200">Cooks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
