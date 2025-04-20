// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Providers from "./providers";    // our new client wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClubHub",
  description: "A directory of clubs built with Next.js, Supabase & Tailwind",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* now wrapped in our client-only Provider */}
        <Providers>
          <nav className="p-4 bg-white shadow flex flex-wrap gap-4">
            <Link href="/"      className="text-gray-700 hover:text-[#12bca2]">Home</Link>
            <Link href="/clubLists"  className="text-gray-700 hover:text-[#12bca2]">All Clubs</Link>
            <Link href="/createClub" className="text-gray-700 hover:text-[#12bca2]">New Club</Link>
            <Link href="/joined"     className="text-gray-700 hover:text-[#12bca2]">Joined</Link>
            <Link href="/following"  className="text-gray-700 hover:text-[#12bca2]">Following</Link>
            <Link href="/aboutUs"    className="text-gray-700 hover:text-[#12bca2]">About Us</Link>
            <Link href="/login"      className="text-gray-700 hover:text-[#12bca2]">Log In</Link>
            <Link href="/register"   className="text-gray-700 hover:text-[#12bca2]">Register</Link>
            <Link href="/friends"    className="text-gray-700 hover:text-[#12bca2]">Friends</Link>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
