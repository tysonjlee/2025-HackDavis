'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

const mockClubs = {
  all: [
    {
      name: 'Tech Club',
      description: 'Coding, hackathons, and more',
      format: 'In-Person',
      host: 'Student',
      image: 'https://i.pravatar.cc/100?u=techclub',
    },
    {
      name: 'Basketball Club',
      description: 'Join us for pickup games',
      format: 'Hybrid',
      host: 'Student',
      image: 'https://i.pravatar.cc/100?u=basketball',
    },
    {
      name: 'Entrepreneurship Society',
      description: 'Build startups with peers',
      format: 'Virtual',
      host: 'Faculty',
      image: 'https://i.pravatar.cc/100?u=entrepreneur',
    },
  ],
  sports: [
    {
      name: 'Basketball Club',
      description: 'Join us for pickup games',
      format: 'Hybrid',
      host: 'Student',
      image: 'https://i.pravatar.cc/100?u=basketball',
    },
    {
      name: 'Soccer Club',
      description: 'Weekly matches and fitness',
      format: 'In-Person',
      host: 'Student',
      image: 'https://i.pravatar.cc/100?u=soccer',
    },
  ],
  tech: [
    {
      name: 'Tech Club',
      description: 'Coding, hackathons, and more',
      format: 'In-Person',
      host: 'Student',
      image: 'https://i.pravatar.cc/100?u=techclub',
    },
    {
      name: 'AI Society',
      description: 'Talks and projects on machine learning',
      format: 'Virtual',
      host: 'Faculty',
      image: 'https://i.pravatar.cc/100?u=ai',
    },
  ],
};

export default function ClubsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [hostFilter, setHostFilter] = useState('');

  const filterClubs = (clubs: any[]) => {
    return clubs.filter((club) => {
      return (
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (formatFilter === '' || club.format === formatFilter) &&
        (hostFilter === '' || club.host === hostFilter)
      );
    });
  };

  return (
    <div className="relative min-h-screen bg-white px-4 py-6">
      {/* 🔵 Top-Left Profile Button */}
      <div className="absolute top-4 left-4">
        <Link href="/profile">
          <Button className="bg-[#002855] text-white hover:bg-[#00509E] font-semibold shadow">
            👤 My Profile
          </Button>
        </Link>
      </div>

      {/* 📅 Top-Right Calendar Button */}
      <div className="absolute top-4 right-4">
        <Link href="/clubCalendar">
          <Button className="bg-[#FFD200] text-[#002855] hover:bg-[#e6c100] font-semibold shadow">
            📅 Club Calendar
          </Button>
        </Link>
      </div>

      {/* 🔵 Title */}
      <h1 className="text-3xl font-bold text-[#002855] text-center mb-8">
        Explore Clubs
      </h1>

      {/* 🔍 Filter Bar */}
      <div className="flex flex-wrap gap-4 max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search clubs..."
          className="flex-grow px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded-md"
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
        >
          <option value="">All Formats</option>
          <option value="In-Person">In-Person</option>
          <option value="Virtual">Virtual</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <select
          className="px-4 py-2 border rounded-md"
          value={hostFilter}
          onChange={(e) => setHostFilter(e.target.value)}
        >
          <option value="">All Hosts</option>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
        </select>
      </div>

      {/* 🗂️ Tabs */}
      <Tabs defaultValue="all" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-[#002855] text-white mb-4">
          <TabsTrigger value="all">All Clubs</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="tech">Tech</TabsTrigger>
        </TabsList>

        {(['all', 'sports', 'tech'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {filterClubs(mockClubs[tab]).map((club, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center border rounded-xl p-4 shadow hover:shadow-lg transition-shadow aspect-square"
                >
                  <img
                    src={club.image}
                    alt={`${club.name} logo`}
                    className="w-20 h-20 rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-[#002855]">{club.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{club.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    <span>Format: {club.format}</span> | <span>Host: {club.host}</span>
                  </div>
                  {/* Buttons */}
                  <div className="flex gap-2 w-full mt-auto pt-4">
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                      ✅ Join
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-300 text-gray-800 hover:bg-gray-100">
                      ⭐ Follow
                    </Button>
                  </div>
                </div>
              ))}
              {filterClubs(mockClubs[tab]).length === 0 && (
                <p className="text-gray-500 italic">No clubs found.</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
