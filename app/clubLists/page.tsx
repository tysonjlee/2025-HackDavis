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
    <div className="relative min-h-screen w-full wavy-bg px-4 py-6">
      {/* 🔵 Top-Left Profile Button */}
      <div className="absolute top-4 left-4">
        <Link href="/profile">
          <Button className="bg-[#002855] text-white hover:bg-[#00509E] font-semibold shadow-md transform hover:scale-105 transition duration-300">
            👤 My Profile
          </Button>
        </Link>
      </div>

      {/* 📅 Top-Right Calendar Button */}
      <div className="absolute top-4 right-4">
        <Link href="/clubCalendar">
          <Button className="bg-[#FFD200] text-[#002855] hover:bg-[#e6c100] font-semibold shadow-md transform hover:scale-105 transition duration-300">
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
        <TabsList className="flex gap-4 justify-center mb-6">
          <TabsTrigger
            value="all"
            className="tab-trigger w-20 h-10 text-center border-2 border-[#002855] bg-white text-[#002855] font-semibold hover:bg-[#00509E] hover:text-white transform hover:scale-105 transition duration-300"
          >
            All Clubs
          </TabsTrigger>
          <TabsTrigger
            value="sports"
            className="tab-trigger w-20 h-10 text-center border-2 border-[#002855] bg-white text-[#002855] font-semibold hover:bg-[#00509E] hover:text-white transform hover:scale-105 transition duration-300"
          >
            Sports
          </TabsTrigger>
          <TabsTrigger
            value="tech"
            className="tab-trigger w-20 h-10 text-center border-2 border-[#002855] bg-white text-[#002855] font-semibold hover:bg-[#00509E] hover:text-white transform hover:scale-105 transition duration-300"
          >
            Tech
          </TabsTrigger>
        </TabsList>

        {(['all', 'sports', 'tech'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="tabs-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filterClubs(mockClubs[tab]).map((club, index) => (
                <div
                  key={index}
                  className="club-card p-6 bg-white rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
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
                  <div className="flex gap-2 w-full mt-4">
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 transition duration-300">
                      ✅ Join
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-300 text-gray-800 hover:bg-gray-100 transform hover:scale-105 transition duration-300">
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
