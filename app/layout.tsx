import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConditionalNavbar } from "@/components/conditional-navbar";
import { AuthProvider } from "@/components/providers/auth-context";
import { AuthSessionProvider } from "@/components/providers/session-provider";

const geistSans = localFont({
  src: [
    {
      path: './fonts/GeistVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

const geistMono = localFont({
  src: [
    {
      path: './fonts/GeistMonoVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
});

export const metadata: Metadata = {
  title: "Potluck - Share Your Favorite Recipes",
  description: "Collect, organize, and share your favorite recipes with friends and family. Import recipes from any website, organize them into collections, and build your personal cookbook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <AuthProvider>
            <ConditionalNavbar />
            {children}
          </AuthProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
