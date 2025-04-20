'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ClubsPage() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* 🟨 Top-Right Club Calendar Button */}
      <div className="absolute top-4 right-4">
        <Link href="/clubCalendar">
          <Button className="bg-[#FFD200] text-[#002855] hover:bg-[#e6c100] font-semibold shadow">
            📅 Club Calendar
          </Button>
        </Link>
      </div>

      {/* 🔵 Centered Content */}
      <div className="flex items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-[#002855]">Worked</h1>
      </div>
    </div>
  );
}
