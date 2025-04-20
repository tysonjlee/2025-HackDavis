'use client';

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative flex flex-col h-screen items-center justify-center overflow-hidden px-4 animated-gradient">
      {/* 🌊 Animated SVG background */}
      <div className="absolute top-0 left-0 w-full overflow-hidden z-0 pointer-events-none">
        <svg
          className="w-full h-[400px] animate-sine-wave transform-gpu"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#002855"
            fillOpacity="0.1"
            d="M0,224L60,224C120,224,240,224,360,197.3C480,171,600,117,720,96C840,75,960,85,1080,96C1200,107,1320,117,1380,122.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* 🔷 ClubHub Logo */}
      <div className="z-10 mb-0 w-[260px]">
        <Image
          src="/clubhub.png"
          alt="ClubHub Logo"
          width={500}
          height={500}
          priority
        />
      </div>

      {/* 🧱 Main content card */}
      <div className="z-10">
        <Card className="w-full max-w-xl shadow-xl border-2 border-[#002855] bg-white rounded-2xl p-10 space-y-0">
          <CardHeader>
            <CardTitle className="text-5xl font-bold text-center text-[#002855]">
              
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <Link href="/login">
              <Button className="w-60 py-4 text-lg bg-[#002855] text-white hover:bg-[#1a3e7c]">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-60 py-4 text-lg bg-[#002855] text-white hover:bg-[#1a3e7c]">
                Register
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 🔗 Link to About Us */}
        <div className="mt-6 text-center">
          <Link href="/aboutUs" className="text-white text-lg underline hover:text-gray-200">
            Learn more about us
          </Link>
        </div>
      </div>
    </main>
  );
}
