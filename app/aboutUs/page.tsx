'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react'; // optional icon for style

export default function AboutUsPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#002855] px-4 py-10 relative">
      {/* Back Button */}
      <Link href="/" className="absolute top-6 right-6">
        <Button variant="outline" className="flex items-center gap-2 text-[#002855] border-[#002855] hover:bg-[#002855] hover:text-white">
          
          Back to Home
        </Button>
      </Link>

      {/* Main Content Card */}
      <Card className="max-w-2xl bg-white text-[#002855] border-2 border-[#002855] shadow-xl rounded-2xl p-8">
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
