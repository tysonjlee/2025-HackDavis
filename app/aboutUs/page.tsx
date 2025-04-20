'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <main className="relative min-h-screen animated-gradient overflow-hidden px-4 py-10 flex items-center justify-center">
      {/* 🌊 Sine Wave Animation */}
      <div className="absolute top-0 left-0 w-full overflow-hidden z-0 pointer-events-none">
        <svg
          className="w-full h-[400px] animate-sine-wave transform-gpu"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.1"
            d="M0,224L60,224C120,224,240,224,360,197.3C480,171,600,117,720,96C840,75,960,85,1080,96C1200,107,1320,117,1380,122.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* 🔙 Back Button */}
      <Link href="/" className="absolute top-6 right-6 z-10">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-[#002855] border-[#002855] hover:bg-[#002855] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>

      {/* 📄 About Card */}
      <Card className="max-w-2xl bg-white text-[#002855] border-2 border-[#002855] shadow-xl rounded-2xl p-8 z-10">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">About ClubHub</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 text-lg leading-relaxed">
          <p>
            <strong>ClubHub</strong> is your go-to social app for discovering and getting involved with clubs on campus. Whether you're looking for new communities, planning your schedule, or wanting to stay connected with friends, ClubHub makes it easy.
          </p>
          <ul className="list-disc mt-4 ml-6 space-y-2">
            <li>Browse a wide range of student clubs and organizations</li>
            <li>Add upcoming club events directly to your calendar</li>
            <li>See which friends are in each club and attending events</li>
          </ul>
          <p className="mt-4">
            With ClubHub, staying connected and involved on campus has never been simpler. Join the fun, find your people, and never miss an event that matters to you.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
